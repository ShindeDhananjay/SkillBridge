import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import StarRating from '../components/StarRating';

function ProjectDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Bid form state
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidForm, setBidForm] = useState({ amount: '', timeline: '', coverMessage: '' });
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState('');

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proj, bidData, reviewData] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/bids/project/${id}`),
          api.get(`/reviews/project/${id}`),
        ]);
        setProject(proj);
        setBids(bidData);
        setReviews(reviewData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidLoading(true);
    try {
      const newBid = await api.post('/bids', {
        project: id,
        amount: Number(bidForm.amount),
        timeline: bidForm.timeline,
        coverMessage: bidForm.coverMessage,
      });
      setBids([newBid, ...bids]);
      setShowBidForm(false);
      setBidForm({ amount: '', timeline: '', coverMessage: '' });
    } catch (err) {
      setBidError(err.message);
    } finally {
      setBidLoading(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await api.put(`/bids/${bidId}/accept`);
      // Refresh data
      const [proj, bidData] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/bids/project/${id}`),
      ]);
      setProject(proj);
      setBids(bidData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await api.put(`/bids/${bidId}/reject`);
      setBids(bids.map((b) => (b._id === bidId ? { ...b, status: 'rejected' } : b)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComplete = async () => {
    try {
      await api.put(`/projects/${id}/complete`);
      setProject({ ...project, status: 'completed' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      let receiver;
      if (user.role === 'business') {
        receiver = project.assignedStudent?._id;
      } else {
        receiver = project.business?._id;
      }
      const newReview = await api.post('/reviews', {
        project: id,
        receiver,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviews([...reviews, newReview]);
      setShowReviewForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg" /></div>;
  }

  if (error && !project) {
    return <div className="container" style={{ padding: '40px 24px' }}><div className="alert alert-error">{error}</div></div>;
  }

  if (!project) return null;

  const isOwner = user && project.business && user._id === project.business._id;
  const isStudent = user && user.role === 'student';
  const isAssigned = user && project.assignedStudent && user._id === project.assignedStudent._id;
  const hasAlreadyBid = bids.some((b) => user && b.student && b.student._id === user._id);
  const hasAlreadyReviewed = reviews.some((r) => user && r.reviewer && r.reviewer._id === user._id);
  const canReview = project.status === 'completed' && (isOwner || isAssigned) && !hasAlreadyReviewed;

  const statusColor = {
    open: 'badge-primary',
    'in-progress': 'badge-warning',
    completed: 'badge-success',
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '900px' }}>
        {/* Project Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <span className={`badge ${statusColor[project.status]}`}>{project.status.replace('-', ' ')}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
              Posted {formatDate(project.createdAt)}
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>
            {project.title}
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--text-light)', lineHeight: 1.7, marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
            {project.description}
          </p>

          {project.requiredSkills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Required Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.requiredSkills.map((s) => (
                  <span key={s} className="badge badge-secondary">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius)', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Budget</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>${project.budgetMin} - ${project.budgetMax}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Deadline</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatDate(project.deadline)}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Posted by</div>
              <Link to={`/user/${project.business._id}`} style={{ fontSize: '16px', fontWeight: 600 }}>
                {project.business.businessName || project.business.name}
              </Link>
            </div>
          </div>

          {project.assignedStudent && (
            <div style={{ padding: '12px 16px', background: 'var(--success-light)', borderRadius: 'var(--radius)', marginBottom: '16px', fontSize: '14px' }}>
              Assigned to: <Link to={`/user/${project.assignedStudent._id}`} style={{ fontWeight: 600 }}>{project.assignedStudent.name}</Link>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {isOwner && project.status === 'open' && (
              <>
                <Link to={`/projects/${id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                <button onClick={handleDelete} className="btn btn-danger btn-sm">Delete</button>
              </>
            )}
            {isOwner && project.status === 'in-progress' && (
              <button onClick={handleComplete} className="btn btn-success btn-sm">Mark Completed</button>
            )}
            {isStudent && project.status === 'open' && !hasAlreadyBid && (
              <button onClick={() => setShowBidForm(true)} className="btn btn-primary btn-sm">Submit a Bid</button>
            )}
            {isAssigned && project.status === 'in-progress' && (
              <button onClick={handleComplete} className="btn btn-success btn-sm">Mark Completed</button>
            )}
            {canReview && (
              <button onClick={() => setShowReviewForm(true)} className="btn btn-primary btn-sm">Leave a Review</button>
            )}
          </div>
        </div>

        {/* Bid Form */}
        {showBidForm && (
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Submit Your Bid</h3>
            {bidError && <div className="alert alert-error">{bidError}</div>}
            <form onSubmit={handleBidSubmit}>
              <div className="form-group">
                <label>Proposed Amount ($)</label>
                <input
                  type="number"
                  value={bidForm.amount}
                  onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                  placeholder="e.g. 500"
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input
                  type="text"
                  value={bidForm.timeline}
                  onChange={(e) => setBidForm({ ...bidForm, timeline: e.target.value })}
                  placeholder="e.g. 2 weeks"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cover Message</label>
                <textarea
                  value={bidForm.coverMessage}
                  onChange={(e) => setBidForm({ ...bidForm, coverMessage: e.target.value })}
                  placeholder="Explain why you're the best fit for this project..."
                  required
                  rows={4}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" disabled={bidLoading}>
                  {bidLoading ? <span className="spinner" /> : 'Submit Bid'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBidForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating</label>
                <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} size={28} />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" disabled={reviewLoading || reviewForm.rating === 0}>
                  {reviewLoading ? <span className="spinner" /> : 'Submit Review'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReviewForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Bids List */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            Bids ({bids.length})
          </h3>
          {bids.length === 0 ? (
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>No bids yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bids.map((bid) => (
                <div key={bid._id} style={{
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  background: bid.status === 'accepted' ? 'var(--success-light)' : bid.status === 'rejected' ? 'var(--danger-light)' : 'var(--bg-white)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link to={`/user/${bid.student._id}`} style={{ fontWeight: 600, fontSize: '15px' }}>
                        {bid.student.name}
                      </Link>
                      {bid.student.averageRating > 0 && (
                        <StarRating rating={Math.round(bid.student.averageRating)} size={13} />
                      )}
                    </div>
                    <span className={`badge ${bid.status === 'accepted' ? 'badge-success' : bid.status === 'rejected' ? 'badge-danger' : 'badge-secondary'}`}>
                      {bid.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '14px', marginBottom: '8px' }}>
                    <span><strong>${bid.amount}</strong></span>
                    <span style={{ color: 'var(--text-light)' }}>{bid.timeline}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: 1.5 }}>
                    {bid.coverMessage}
                  </p>
                  {isOwner && project.status === 'open' && bid.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button onClick={() => handleAcceptBid(bid._id)} className="btn btn-success btn-sm">Accept</button>
                      <button onClick={() => handleRejectBid(bid._id)} className="btn btn-danger btn-sm">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              Reviews ({reviews.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((review) => (
                <div key={review._id} style={{ padding: '12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{review.reviewer?.name}</span>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  {review.comment && (
                    <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
