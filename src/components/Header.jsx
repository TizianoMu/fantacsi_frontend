import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Welcome to the Fantasy Championship</h1>
      <nav className="header-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/championships">Championships</a></li>
          <li><a href="/players">Players</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;