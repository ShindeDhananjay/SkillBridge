import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

function VerifyEmail() {
  const { token } = useParams();
  const { loadUser } = useContext(AuthContext);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await api.get(`/auth/verify-email/${token}`);
        setMessage(data.message);
        setStatus('success');
        loadUser();
      } catch (err) {
        setMessage(err.message);
        setStatus('error');
      }
    };
    verify();
  }, [token, loadUser]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div className="spinner spinner-lg" style={{ margin: '0 auto 16px' }} />
            <p>Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--success)' }}>&#10003;</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '20px' }}>{message}</p>
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--danger)' }}>&#10007;</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '20px' }}>{message}</p>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
