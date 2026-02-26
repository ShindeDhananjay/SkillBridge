import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import StarRating from '../components/StarRating';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'business') {
          const data = await api.get('/projects/my');
          setProjects(data);
        } else {
          const [bidData, assignedData] = await Promise.all([
            api.get('/bids/my'),
            api.get('/projects/assigned'),
          ]);
          setBids(bidData);
          setProjects(assignedData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const statusColor = {
    open: 'badge-primary',
    'in-progress': 'badge-warning',
    completed: 'badge-success',
    pending: 'badge-secondary',
    accepted: 'badge-success',
    rejected: 'badge-danger',
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg" /></div>;
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
            Welcome back, {user.name} ({user.role})
            {!user.isVerified && (
              <span style={{ color: 'var(--warning)', marginLeft: '8px' }}>
                &mdash; Please verify your email
              </span>
            )}
          </p>
        </div>
        {user.role === 'business' && (
          <Link to="/projects/new" className="btn btn-primary">Post a Project</Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {user.role === 'business' ? (
          <>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>{projects.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Total Projects</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>{projects.filter((p) => p.status === 'open').length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Open</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)' }}>{projects.filter((p) => p.status === 'in-progress').length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>In Progress</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>{projects.filter((p) => p.status === 'completed').length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Completed</div>
            </div>
          </>
        ) : (
          <>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>{bids.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Total Bids</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>{bids.filter((b) => b.status === 'accepted').length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Accepted</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)' }}>{projects.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Assigned Projects</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent)' }}>{user.averageRating || 0}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>Avg Rating</div>
            </div>
          </>
        )}
      </div>

      {/* Business: My Projects */}
      {user.role === 'business' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>My Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects yet</h3>
              <p>Post your first project to get started</p>
              <Link to="/projects/new" className="btn btn-primary">Post a Project</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map((p) => (
                <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{p.title}</h3>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-light)' }}>
                        <span>Due {formatDate(p.deadline)}</span>
                        <span>${p.budgetMin} - ${p.budgetMax}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {p.assignedStudent && (
                        <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>Assigned: {p.assignedStudent.name}</span>
                      )}
                      <span className={`badge ${statusColor[p.status]}`}>{p.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student: My Bids */}
      {user.role === 'student' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>My Bids</h2>
          {bids.length === 0 ? (
            <div className="empty-state">
              <h3>No bids yet</h3>
              <p>Browse projects and submit your first bid</p>
              <Link to="/projects" className="btn btn-primary">Browse Projects</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bids.map((bid) => (
                <Link key={bid._id} to={`/projects/${bid.project?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{bid.project?.title || 'Project'}</h3>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-light)' }}>
                        <span>Your bid: ${bid.amount}</span>
                        <span>{bid.timeline}</span>
                        {bid.project?.business && (
                          <span>by {bid.project.business.businessName || bid.project.business.name}</span>
                        )}
                      </div>
                    </div>
                    <span className={`badge ${statusColor[bid.status]}`}>{bid.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Assigned to Me</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((p) => (
                  <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{p.title}</h3>
                        <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                          by {p.business?.businessName || p.business?.name}
                        </span>
                      </div>
                      <span className={`badge ${statusColor[p.status]}`}>{p.status.replace('-', ' ')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
