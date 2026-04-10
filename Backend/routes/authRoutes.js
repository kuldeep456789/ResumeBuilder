const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { pool, ensureAuthSchema, isDatabaseConfigured } = require('../services/db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || '';

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

const normalizeEmail = (value) => (value || '').trim().toLowerCase() || null;
const normalizePhone = (value) => {
  const cleaned = (value || '').trim().replace(/[^\d+]/g, '');
  return cleaned || null;
};

const sanitizeName = (value) => (value || '').trim();

const formatUser = (userRow) => ({
  id: userRow.id,
  fullName: userRow.full_name,
  email: userRow.email,
  phone: userRow.phone,
  authProvider: userRow.auth_provider
});

const createToken = (userRow) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Please set it in Backend/.env');
  }

  return jwt.sign(
    {
      userId: userRow.id,
      email: userRow.email,
      phone: userRow.phone,
      fullName: userRow.full_name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const resolveProvider = (userRow, newProvider) => {
  const hasLocal = Boolean(userRow.password_hash);
  const hasGoogle = Boolean(userRow.google_sub);
  const hasGithub = Boolean(userRow.github_id);

  if (newProvider === 'google') {
    return hasLocal || hasGithub ? 'hybrid' : 'google';
  }

  if (newProvider === 'github') {
    return hasLocal || hasGoogle ? 'hybrid' : 'github';
  }

  return newProvider;
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server auth configuration is missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired auth token' });
  }
};

router.get('/status', (req, res) => {
  res.json({
    databaseConfigured: isDatabaseConfigured,
    googleConfigured: Boolean(GOOGLE_CLIENT_ID),
    githubConfigured: Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET),
    jwtConfigured: Boolean(JWT_SECRET)
  });
});

router.post('/register', async (req, res) => {
  try {
    await ensureAuthSchema();

    const fullName = sanitizeName(req.body.fullName || req.body.name);
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);
    const password = String(req.body.password || '');

    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone number is required' });
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      return res.status(400).json({ error: 'Please enter a valid international phone number' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await pool.query(
      `
      SELECT *
      FROM app_users
      WHERE ($1::text IS NOT NULL AND email = $1)
         OR ($2::text IS NOT NULL AND phone = $2)
      LIMIT 1;
      `,
      [email, phone]
    );

    let user;
    const passwordHash = await bcrypt.hash(password, 10);

    if (existing.rows.length > 0) {
      const foundUser = existing.rows[0];

      if (foundUser.password_hash) {
        return res.status(409).json({ error: 'Account already exists. Please login.' });
      }

      const upgraded = await pool.query(
        `
        UPDATE app_users
        SET
          full_name = $1,
          password_hash = $2,
          auth_provider = CASE WHEN auth_provider IN ('google', 'github', 'hybrid') THEN 'hybrid' ELSE auth_provider END,
          updated_at = NOW(),
          last_login_at = NOW()
        WHERE id = $3
        RETURNING *;
        `,
        [fullName, passwordHash, foundUser.id]
      );

      user = upgraded.rows[0];
    } else {
      const inserted = await pool.query(
        `
        INSERT INTO app_users (full_name, email, phone, password_hash, auth_provider, last_login_at)
        VALUES ($1, $2, $3, $4, 'local', NOW())
        RETURNING *;
        `,
        [fullName, email, phone, passwordHash]
      );

      user = inserted.rows[0];
    }

    const token = createToken(user);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: formatUser(user)
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    await ensureAuthSchema();

    const identifierInput = String(req.body.identifier || '').trim();
    const password = String(req.body.password || '');

    if (!identifierInput || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    const email = identifierInput.includes('@') ? normalizeEmail(identifierInput) : null;
    const phone = email ? null : normalizePhone(identifierInput);

    const userQuery = await pool.query(
      `
      SELECT *
      FROM app_users
      WHERE ($1::text IS NOT NULL AND email = $1)
         OR ($2::text IS NOT NULL AND phone = $2)
      LIMIT 1;
      `,
      [email, phone]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userQuery.rows[0];

    if (!user.password_hash) {
      return res.status(400).json({ error: 'This account uses social sign-in. Continue with Google or GitHub.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const updated = await pool.query(
      `
      UPDATE app_users
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *;
      `,
      [user.id]
    );

    const latestUser = updated.rows[0];
    const token = createToken(latestUser);

    return res.json({
      message: 'Login successful',
      token,
      user: formatUser(latestUser)
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    await ensureAuthSchema();

    if (!googleClient) {
      return res.status(503).json({ error: 'Google login is not configured on the server' });
    }

    const credential = String(req.body.credential || '');
    if (!credential) {
      return res.status(400).json({ error: 'Google credential token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = normalizeEmail(payload?.email);
    const fullName = sanitizeName(payload?.name || 'Google User');
    const googleSub = payload?.sub || null;

    if (!payload?.email_verified || !email) {
      return res.status(400).json({ error: 'Google account email is not verified' });
    }

    const existing = await pool.query(
      `
      SELECT *
      FROM app_users
      WHERE email = $1
         OR ($2::text IS NOT NULL AND google_sub = $2)
      LIMIT 1;
      `,
      [email, googleSub]
    );

    let user;
    if (existing.rows.length > 0) {
      const found = existing.rows[0];
      const provider = resolveProvider(found, 'google');

      const updated = await pool.query(
        `
        UPDATE app_users
        SET
          full_name = COALESCE(NULLIF($1, ''), full_name),
          email = $2,
          google_sub = COALESCE($3, google_sub),
          auth_provider = $4,
          updated_at = NOW(),
          last_login_at = NOW()
        WHERE id = $5
        RETURNING *;
        `,
        [fullName, email, googleSub, provider, found.id]
      );

      user = updated.rows[0];
    } else {
      const inserted = await pool.query(
        `
        INSERT INTO app_users (full_name, email, google_sub, auth_provider, last_login_at)
        VALUES ($1, $2, $3, 'google', NOW())
        RETURNING *;
        `,
        [fullName, email, googleSub]
      );

      user = inserted.rows[0];
    }

    const token = createToken(user);

    return res.json({
      message: 'Google login successful',
      token,
      user: formatUser(user)
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    return res.status(500).json({ error: 'Google login failed', details: error.message });
  }
});

router.post('/github', async (req, res) => {
  try {
    await ensureAuthSchema();

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return res.status(503).json({ error: 'GitHub login is not configured on the server' });
    }

    const code = String(req.body.code || '').trim();
    if (!code) {
      return res.status(400).json({ error: 'GitHub authorization code is required' });
    }

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code
    });

    if (GITHUB_REDIRECT_URI) {
      params.set('redirect_uri', GITHUB_REDIRECT_URI);
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const tokenPayload = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenPayload.access_token) {
      return res.status(400).json({
        error: 'GitHub token exchange failed',
        details: tokenPayload.error_description || tokenPayload.error || 'Unable to exchange code for token'
      });
    }

    const accessToken = tokenPayload.access_token;
    const githubHeaders = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'resume-auth-service'
    };

    const [profileResponse, emailsResponse] = await Promise.all([
      fetch('https://api.github.com/user', { headers: githubHeaders }),
      fetch('https://api.github.com/user/emails', { headers: githubHeaders })
    ]);

    if (!profileResponse.ok) {
      return res.status(400).json({ error: 'Failed to fetch GitHub profile' });
    }

    const profile = await profileResponse.json();
    const emails = emailsResponse.ok ? await emailsResponse.json() : [];

    const githubId = String(profile?.id || '').trim() || null;
    const githubUsername = String(profile?.login || '').trim() || null;

    const primaryEmailObj = Array.isArray(emails)
      ? emails.find((item) => item.primary && item.verified) ||
        emails.find((item) => item.verified) ||
        emails[0]
      : null;

    const email = normalizeEmail(primaryEmailObj?.email || profile?.email);
    const fullName = sanitizeName(profile?.name || githubUsername || 'GitHub User');

    if (!githubId || !githubUsername) {
      return res.status(400).json({ error: 'GitHub profile details are incomplete' });
    }

    if (!email) {
      return res.status(400).json({ error: 'GitHub account email is not available. Add a verified email in GitHub and try again.' });
    }

    const existing = await pool.query(
      `
      SELECT *
      FROM app_users
      WHERE email = $1
         OR ($2::text IS NOT NULL AND github_id = $2)
      LIMIT 1;
      `,
      [email, githubId]
    );

    let user;

    if (existing.rows.length > 0) {
      const found = existing.rows[0];
      const provider = resolveProvider(found, 'github');

      const updated = await pool.query(
        `
        UPDATE app_users
        SET
          full_name = COALESCE(NULLIF($1, ''), full_name),
          email = $2,
          github_id = COALESCE($3, github_id),
          github_username = COALESCE($4, github_username),
          auth_provider = $5,
          updated_at = NOW(),
          last_login_at = NOW()
        WHERE id = $6
        RETURNING *;
        `,
        [fullName, email, githubId, githubUsername, provider, found.id]
      );

      user = updated.rows[0];
    } else {
      const inserted = await pool.query(
        `
        INSERT INTO app_users (full_name, email, github_id, github_username, auth_provider, last_login_at)
        VALUES ($1, $2, $3, $4, 'github', NOW())
        RETURNING *;
        `,
        [fullName, email, githubId, githubUsername]
      );

      user = inserted.rows[0];
    }

    const token = createToken(user);

    return res.json({
      message: 'GitHub login successful',
      token,
      user: formatUser(user)
    });
  } catch (error) {
    console.error('GitHub Login Error:', error);
    return res.status(500).json({ error: 'GitHub login failed', details: error.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    await ensureAuthSchema();

    const userQuery = await pool.query(
      'SELECT * FROM app_users WHERE id = $1 LIMIT 1;',
      [req.auth.userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: formatUser(userQuery.rows[0]) });
  } catch (error) {
    console.error('Me Endpoint Error:', error);
    return res.status(500).json({ error: 'Unable to fetch user profile' });
  }
});

router.post('/logout', (req, res) => {
  return res.json({ message: 'Logout successful' });
});

module.exports = router;
