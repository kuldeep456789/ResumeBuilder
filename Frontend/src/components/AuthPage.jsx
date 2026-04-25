import React, { useMemo, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { clearSession, loginUser, loginWithGoogle, registerUser, saveSession } from '../services/authService';
import './AuthPage.css';

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
  const [guestLoading, setGuestLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleEnabled = useMemo(() => Boolean(googleClientId), [googleClientId]);

  const handleGuestLogin = () => {
    setGuestLoading(true);
    setTimeout(() => {
      const guestSession = {
        token: 'guest-token',
        user: {
          id: 'guest',
          fullName: 'Guest User',
          email: 'guest@resumestudio.local',
          isGuest: true
        }
      };
      clearSession();
      saveSession(guestSession);
      onAuthSuccess(guestSession);
    }, 600);
  };

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
    <div className="auth-page-wrapper">
      {/* Background Narrative */}
      <div className="auth-bg-narrative"></div>
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>

      <main className="auth-main-container">
        {/* Top Header / Brand Anchor */}
        <header className="auth-header">
          <span className="auth-subtitle">Command Center</span>
          <h1 className="auth-title">RESUME.</h1>
          <div className="auth-separator-line"></div>
        </header>

        {/* Form Container */}
        <div className="auth-contentbox">
          <div className="auth-headline-group">
            <h2>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>
              {mode === 'signin' 
                ? 'Please enter your credentials to access the studio.' 
                : 'Join us to command your professional presence.'}
            </p>
          </div>

          <div className="auth-mode-toggle">
            <button
              type="button"
              className={`auth-mode-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => { setMode('signin'); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-mode-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {mode === 'signin' ? (
            <form className="auth-form" onSubmit={handleSignInSubmit}>
              <div className="auth-input-group">
                <div className="auth-field-wrapper">
                  <label className="auth-field-label">Email Address</label>
                  <input
                    type="email"
                    className="auth-input"
                    value={signInForm.identifier}
                    onChange={(e) => setSignInForm((prev) => ({ ...prev, identifier: e.target.value }))}
                    placeholder="you@email.com"
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="auth-field-wrapper">
                  <label className="auth-field-label">Password</label>
                  <input
                    type="password"
                    className="auth-input"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    minLength={6}
                  />
                </div>
              </div>
              <div className="auth-forgot-pwd">
                <a href="#">Forgot Password?</a>
              </div>
              <button className="auth-submit-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignUpSubmit}>
              <div className="auth-input-group">
                <div className="auth-field-wrapper">
                  <label className="auth-field-label">Full Name</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Your complete name"
                    required
                  />
                </div>
                <div className="auth-field-wrapper">
                  <label className="auth-field-label">Email Address</label>
                  <input
                    type="email"
                    className="auth-input"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="auth-field-wrapper">
                  <label className="auth-field-label">Password</label>
                  <input
                    type="password"
                    className="auth-input"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div className="auth-field-wrapper">
                  <label className="auth-field-label">Confirm Password</label>
                  <input
                    type="password"
                    className="auth-input"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button className="auth-submit-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="auth-divider-wrap">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">Or continue with</span>
          </div>

          {isGoogleEnabled ? (
            <div className="auth-social-wrap">
              <div className="google-login-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign-in failed. Please try again.')}
                  shape="rectangular"
                  theme="filled_black"
                  size="large"
                  text={mode === 'signin' ? 'signin_with' : 'signup_with'}
                />
              </div>
            </div>
          ) : (
            <p className="social-disabled-note">
              Google login disabled. Connect Google Client ID to enable.
            </p>
          )}

          {error && <div className="auth-error">{error}</div>}

          {/* Guest Login */}
          <div className="auth-guest-divider">
            <span>or</span>
          </div>
          <button
            type="button"
            className="auth-guest-btn"
            onClick={handleGuestLogin}
            disabled={guestLoading || isSubmitting}
          >
            {guestLoading ? (
              <>
                <span className="auth-guest-spinner"></span>
                Entering Studio...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">person</span>
                Continue as Guest — Free &amp; No Sign-Up
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
