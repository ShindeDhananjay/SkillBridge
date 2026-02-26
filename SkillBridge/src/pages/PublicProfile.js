import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import StarRating from '../components/StarRating';

function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, reviewData] = await Promise.all([
          api.get(`/auth/user/${id}`),
          api.get(`/reviews/user/${id}`),
        ]);
        setProfile(user);
        setReviews(reviewData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg" /></div>;
  }

  if (error || !profile) {
    return (
      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="alert alert-error">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '640px' }}>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
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
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700 }}>{profile.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="badge badge-primary">{profile.role}</span>
              <StarRating rating={Math.round(profile.averageRating || 0)} size={14} />
              <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                ({profile.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {profile.bio && (
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-light)', marginBottom: '16px' }}>
            {profile.bio}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {profile.role === 'student' && profile.university && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '2px' }}>University</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{profile.university}</div>
            </div>
          )}
          {profile.role === 'business' && profile.businessName && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '2px' }}>Business</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{profile.businessName}</div>
            </div>
          )}
          {profile.role === 'business' && profile.industry && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '2px' }}>Industry</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{profile.industry}</div>
            </div>
          )}
        </div>

        {profile.role === 'student' && profile.skills?.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '6px' }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.skills.map((s) => (
                <span key={s} className="badge badge-secondary">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Reviews ({reviews.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map((review) => (
              <div key={review._id} style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{review.reviewer?.name}</span>
                  <StarRating rating={review.rating} size={13} />
                  {review.project?.title && (
                    <span style={{ fontSize: '12px', color: 'var(--text-lighter)' }}>on {review.project.title}</span>
                  )}
                </div>
                {review.comment && (
                  <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: 1.5 }}>{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicProfile;
