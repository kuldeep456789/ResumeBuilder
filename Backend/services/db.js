const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;
const isDatabaseConfigured = Boolean(databaseUrl);

const pool = isDatabaseConfigured
  ? new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  })
  : null;

let schemaReadyPromise = null;

const ensureAuthSchema = async () => {
  if (!pool) {
    throw new Error('DATABASE_URL is missing. Please set it in Backend/.env');
  }

  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_users (
          id BIGSERIAL PRIMARY KEY,
          full_name VARCHAR(120) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(25),
          password_hash TEXT,
          google_sub VARCHAR(255),
          github_id VARCHAR(255),
          github_username VARCHAR(255),
          auth_provider VARCHAR(20) NOT NULL DEFAULT 'local',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          last_login_at TIMESTAMPTZ
        );
      `);

      await pool.query(`
        ALTER TABLE app_users
        ADD COLUMN IF NOT EXISTS github_id VARCHAR(255);
      `);

      await pool.query(`
        ALTER TABLE app_users
        ADD COLUMN IF NOT EXISTS github_username VARCHAR(255);
      `);

      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS app_users_email_unique
        ON app_users (email)
        WHERE email IS NOT NULL;
      `);

      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS app_users_phone_unique
        ON app_users (phone)
        WHERE phone IS NOT NULL;
      `);

      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS app_users_google_sub_unique
        ON app_users (google_sub)
        WHERE google_sub IS NOT NULL;
      `);

      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS app_users_github_id_unique
        ON app_users (github_id)
        WHERE github_id IS NOT NULL;
      `);
    })().catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }

  return schemaReadyPromise;
};

module.exports = {
  pool,
  ensureAuthSchema,
  isDatabaseConfigured
};
