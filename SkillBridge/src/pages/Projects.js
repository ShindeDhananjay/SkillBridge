import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StarRating from '../components/StarRating';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let query = '/projects?';
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (skill) query += `skill=${encodeURIComponent(skill)}&`;
      const data = await api.get(query);
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Browse Projects</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>
          Find open projects that match your skills
        </p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '28px',
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Filter by skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          style={{
            width: '180px',
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner spinner-lg" />
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}>
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{ height: '100%', transition: 'box-shadow 0.15s ease, transform 0.15s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-primary">{project.status}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                    Due {formatDate(project.deadline)}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                  {project.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-light)',
                  marginBottom: '16px',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {project.description}
                </p>
                {project.requiredSkills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {project.requiredSkills.slice(0, 4).map((s) => (
                      <span key={s} className="badge badge-secondary">{s}</span>
                    ))}
                    {project.requiredSkills.length > 4 && (
                      <span className="badge badge-secondary">+{project.requiredSkills.length - 4}</span>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>
                    ${project.budgetMin} - ${project.budgetMax}
                  </span>
                  {project.business && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-light)' }}>
                      <span>{project.business.businessName || project.business.name}</span>
                      {project.business.averageRating > 0 && (
                        <StarRating rating={Math.round(project.business.averageRating)} size={12} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
