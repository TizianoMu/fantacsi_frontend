// frontend/src/auth/pages/AuthPage.jsx
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm'; // Assicurati che il percorso sia corretto
import RegisterForm from '../components/RegisterForm';
import ResettingPasswordForm from '../components/ResettingPasswordForm';
import { useAuth } from '../AuthContext';
import { useLocation } from 'react-router-dom';

const AuthPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isResettingPassword, setResettingPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const location = useLocation();
  const successMessage = location.state?.successMessage;


  return (
    <>
    {successMessage && (
      <div className="welcome-notification">
        {successMessage}
      </div>
    )}
    <div className="central-box">
      <div
        className="auth-toggle-buttons"
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <button
          className={`button${
            (showLogin && !isResettingPassword) ? ' button-active' : ' button-not-active'
          }`}
          onClick={() => {  setShowLogin(true); setResettingPassword(false); }}
          type="button"
        >
          Accedi
        </button>
        <button
          className={`button${
              (!showLogin && !isResettingPassword) ? ' button-active' : ' button-not-active'
          }`}
            onClick={() => { setShowLogin(false); setResettingPassword(false); }}
          type="button"
        >
          Registrati
        </button>
      </div>
      <div className="forms-wrapper">
        {isResettingPassword ? (
          <ResettingPasswordForm onCancel={() => setResettingPassword(false)} />
        ) : (
          showLogin ? <LoginForm /> : <RegisterForm />
        )}
      </div>
        {(!isResettingPassword && showLogin) ? (
        <p className="reset-password-prompt">
          Non ti ricordi la password? <span onClick={() => setResettingPassword(true)}>Clicca qui</span> per resettarla.
        </p>
      ) : null}
    </div>
    </>

  );
};

export default AuthPage;