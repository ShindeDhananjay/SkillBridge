import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const p = await api.get(`/projects/${id}`);
        setForm({
          title: p.title,
          description: p.description,
          requiredSkills: p.requiredSkills.join(', '),
          budgetMin: p.budgetMin,
          budgetMax: p.budgetMax,
          deadline: p.deadline ? p.deadline.substring(0, 10) : '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/projects/${id}`, {
        ...form,
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
      });
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading-container"><div className="spinner spinner-lg" /></div>;
  }

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '640px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Edit Project</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={5} />
          </div>
          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <input type="text" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Min Budget ($)</label>
              <input type="number" name="budgetMin" value={form.budgetMin} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Max Budget ($)</label>
              <input type="number" name="budgetMax" value={form.budgetMax} onChange={handleChange} required min="1" />
            </div>
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/projects/${id}`)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProject;
