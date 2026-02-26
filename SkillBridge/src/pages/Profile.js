import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StarRating from '../components/StarRating';

function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    university: user?.university || '',
    skills: user?.skills?.join(', ') || '',
    businessName: user?.businessName || '',
    industry: user?.industry || '',
    website: user?.website || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = {
        name: form.name,
        bio: form.bio,
      };
      if (user.role === 'student') {
        data.university = form.university;
        data.skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        data.businessName = form.businessName;
        data.industry = form.industry;
        data.website = form.website;
      }
      await updateProfile(data);
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '640px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>My Profile</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {!editing ? (
          <>
            {/* Profile display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{user.name}</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>{user.email}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span className="badge badge-primary">{user.role}</span>
                  <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>

            {user.bio && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Bio</h4>
                <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{user.bio}</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {user.role === 'student' && (
                <>
                  {user.university && (
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>University</h4>
                      <p style={{ fontSize: '14px' }}>{user.university}</p>
                    </div>
                  )}
                  {user.skills?.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Skills</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {user.skills.map((s) => (
                          <span key={s} className="badge badge-secondary">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              {user.role === 'business' && (
                <>
                  {user.businessName && (
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Business Name</h4>
                      <p style={{ fontSize: '14px' }}>{user.businessName}</p>
                    </div>
                  )}
                  {user.industry && (
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Industry</h4>
                      <p style={{ fontSize: '14px' }}>{user.industry}</p>
                    </div>
                  )}
                  {user.website && (
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Website</h4>
                      <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px' }}>{user.website}</a>
                    </div>
                  )}
                </>
              )}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>Rating</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StarRating rating={Math.round(user.averageRating || 0)} size={16} />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.averageRating || 0}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>({user.totalReviews || 0} reviews)</span>
                </div>
              </div>
            </div>

            <button onClick={() => setEditing(true)} className="btn btn-primary">Edit Profile</button>
          </>
        ) : (
          /* Edit form */
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={3} />
            </div>
            {user.role === 'student' && (
              <>
                <div className="form-group">
                  <label>University</label>
                  <input type="text" name="university" value={form.university} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Skills (comma separated)</label>
                  <input type="text" name="skills" value={form.skills} onChange={handleChange} />
                </div>
              </>
            )}
            {user.role === 'business' && (
              <>
                <div className="form-group">
                  <label>Business Name</label>
                  <input type="text" name="businessName" value={form.businessName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <input type="text" name="industry" value={form.industry} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input type="text" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
