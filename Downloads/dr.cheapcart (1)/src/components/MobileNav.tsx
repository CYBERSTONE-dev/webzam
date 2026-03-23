import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const MobileNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} aria-label="Home">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        <span className="nav-label">Home</span>
      </Link>
      
      <Link to="/catalog" className={`nav-item ${isActive('/catalog') ? 'active' : ''}`} aria-label="Shop">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span className="nav-label">Shop</span>
      </Link>
      
      <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`} aria-label="My Account">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span className="nav-label">Account</span>
      </Link>
      
      <Link to="/orders" className={`nav-item ${isActive('/orders') ? 'active' : ''}`} aria-label="My Orders">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
        <span className="nav-label">Orders</span>
      </Link>
    </nav>
  );
};
