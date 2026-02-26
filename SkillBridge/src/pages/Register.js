import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useEffect } from 'react';

function Register() {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    university: '',
    skills: '',
    businessName: '',
    industry: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // if (user) {
  //   navigate('/dashboard', { replace: true });
  //   return null;
  // }
  
  

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      if (form.role === 'student') {
        data.university = form.university;
        data.skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        data.businessName = form.businessName;
        data.industry = form.industry;
      }
      await register(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Create an account</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '24px' }}>
          Join SkillBridge as a student or business
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>I am a...</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                border: form.role === 'student' ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                background: form.role === 'student' ? 'var(--primary-light)' : 'var(--bg-white)',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={form.role === 'student'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                Student
              </label>
              <label style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                border: form.role === 'business' ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                background: form.role === 'business' ? 'var(--primary-light)' : 'var(--bg-white)',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                <input
                  type="radio"
                  name="role"
                  value="business"
                  checked={form.role === 'business'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                Business
              </label>
            </div>
          </div>

          {form.role === 'student' && (
            <>
              <div className="form-group">
                <label htmlFor="university">University</label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                  placeholder="e.g. MIT, Stanford"
                />
              </div>
              <div className="form-group">
                <label htmlFor="skills">Skills (comma separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js, UI Design"
                />
              </div>
            </>
          )}

          {form.role === 'business' && (
            <>
              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Your company name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="e.g. Technology, Retail"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-light)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
