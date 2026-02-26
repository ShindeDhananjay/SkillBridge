import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      background: 'var(--bg-white)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        <Link to="/" style={{
          fontSize: '20px',
          fontWeight: 800,
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          SkillBridge
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }} className="desktop-nav">
          <Link to="/projects" className="btn btn-secondary btn-sm">
            Browse Projects
          </Link>
          {user ? (
            <>
              {user.role === 'business' && (
                <Link to="/projects/new" className="btn btn-primary btn-sm">
                  Post a Project
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                Dashboard
              </Link>
              <Link to="/profile" className="btn btn-secondary btn-sm">
                Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-toggle"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: 'var(--text)',
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? '\u2715' : '\u2630'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'var(--bg-white)',
        }} className="mobile-menu">
          <Link to="/projects" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
            Browse Projects
          </Link>
          {user ? (
            <>
              {user.role === 'business' && (
                <Link to="/projects/new" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                  Post a Project
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/profile" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
