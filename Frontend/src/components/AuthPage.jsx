import React, { useMemo, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { clearSession, loginUser, loginWithGoogle, registerUser, saveSession } from '../services/authService';
import './AuthPage.css';

const GmailIcon = ({ size = 18 }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="4" width="20" height="16" rx="2.4" fill="#FFFFFF" />
    <path d="M2.8 19.5V7.2L8.1 11.1V19.5H2.8Z" fill="#4285F4" />
    <path d="M21.2 19.5V7.2L15.9 11.1V19.5H21.2Z" fill="#0F9D58" />
    <path d="M2.8 6.7L12 13.8L21.2 6.7V9.2L12 16.2L2.8 9.2V6.7Z" fill="#EA4335" />
    <path d="M15.9 11.1L19.3 8.5L21.2 9.9V6.7L15.9 11.1Z" fill="#FBBC05" />
  </svg>
);

const GoogleIcon = ({ size = 18 }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.6-5.4 3.6-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.5 14.6 2.5 12 2.5 6.9 2.5 2.8 6.7 2.8 11.8S6.9 21.1 12 21.1c6.9 0 9.1-4.8 9.1-7.2 0-.5-.1-.9-.1-1.2H12z"
    />
    <path
      fill="#34A853"
      d="M3.8 7.1l3.2 2.4c.9-1.8 2.7-3 5-3 1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.5 14.6 2.5 12 2.5c-3.6 0-6.8 2.1-8.2 5.1z"
    />
    <path
      fill="#4A90E2"
      d="M12 21.1c2.5 0 4.6-.8 6.1-2.2l-2.8-2.3c-.7.5-1.8 1-3.3 1-2.3 0-4.2-1.5-4.9-3.6L3.9 16c1.4 3 4.5 5.1 8.1 5.1z"
    />
    <path
      fill="#FBBC05"
      d="M7.1 14c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.9 7.8c-.6 1.2-1 2.6-1 4.2s.4 3 1 4.2L7.1 14z"
    />
  </svg>
);

const initialSignInState = {
  identifier: '',
  password: ''
};

const initialSignUpState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const AuthPage = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('signin');
  const [signInForm, setSignInForm] = useState(initialSignInState);
  const [signUpForm, setSignUpForm] = useState(initialSignUpState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleEnabled = useMemo(() => Boolean(googleClientId), [googleClientId]);

  const handleSessionSuccess = (sessionPayload) => {
    clearSession();
    saveSession(sessionPayload);
    onAuthSuccess(sessionPayload);
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = await loginUser({
        identifier: signInForm.identifier.trim(),
        password: signInForm.password
      });
      handleSessionSuccess(payload);
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = await registerUser({
        fullName: signUpForm.fullName.trim(),
        email: signUpForm.email.trim(),
        phone: null,
        password: signUpForm.password
      });
      handleSessionSuccess(payload);
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign up right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError('Google login did not return a valid credential.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const payload = await loginWithGoogle(credentialResponse.credential);
      handleSessionSuccess(payload);
    } catch (googleError) {
      setError(googleError.message || 'Google login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card simple">
        <div className="auth-brand">
          <div className="auth-brand-icon">R</div>
          <div className="auth-brand-copy">
            <h1>Welcome</h1>
            <p>Sign in or sign up with Gmail/email</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => {
              setMode('signin');
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => {
              setMode('signup');
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        {mode === 'signin' ? (
          <form className="auth-form" onSubmit={handleSignInSubmit}>
            <label>
              Gmail / Email
              <div className="input-with-icon">
                <GmailIcon size={18} />
                <input
                  type="email"
                  value={signInForm.identifier}
                  onChange={(event) => setSignInForm((prev) => ({ ...prev, identifier: event.target.value }))}
                  placeholder="you@gmail.com"
                  required
                  autoComplete="username"
                />
              </div>
            </label>

            <label>
              Password
              <input
                type="password"
                value={signInForm.password}
                onChange={(event) => setSignInForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                minLength={6}
              />
            </label>

            <button className="auth-submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In with Gmail'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignUpSubmit}>
            <label>
              Full Name
              <input
                type="text"
                value={signUpForm.fullName}
                onChange={(event) => setSignUpForm((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="Your full name"
                required
              />
            </label>

            <label>
              Gmail / Email
              <div className="input-with-icon">
                <GmailIcon size={18} />
                <input
                  type="email"
                  value={signUpForm.email}
                  onChange={(event) => setSignUpForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="you@gmail.com"
                  required
                  autoComplete="email"
                />
              </div>
            </label>

            <label>
              Password
              <input
                type="password"
                value={signUpForm.password}
                onChange={(event) => setSignUpForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Create password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                value={signUpForm.confirmPassword}
                onChange={(event) => setSignUpForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                placeholder="Confirm password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>

            <button className="auth-submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign Up with Gmail'}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {isGoogleEnabled ? (
          <div className="social-provider-card">
            <div className="social-provider-row">
              <GoogleIcon size={18} />
              <span>Continue with Google</span>
            </div>
            <div className="google-login-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed. Please try again.')}
                shape="pill"
                text="continue_with"
                theme="outline"
                size="large"
                logo_alignment="left"
              />
            </div>
          </div>
        ) : (
          <p className="social-disabled-note">
            Google login disabled. Set <code>VITE_GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_ID</code>.
          </p>
        )}

        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
};

export default AuthPage;
