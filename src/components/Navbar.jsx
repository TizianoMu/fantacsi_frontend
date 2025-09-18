import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/championships">
          <img
            src={logo}
            alt="Logo App"
            className="app-logo"
          />
        </Link>
      </div>
      <div className="navbar-links" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated && (
          <>
            <Link to="/profile" className="navbar-username-link">
            <span className="navbar-username"><FontAwesomeIcon icon={faUser} /> {user?.username}</span>
            </Link>
            <button className="button" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;