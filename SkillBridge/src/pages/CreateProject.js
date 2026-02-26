import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function CreateProject() {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        ...form,
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
      };
      const project = await api.post('/projects', data);
      navigate(`/projects/${project._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '640px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Post a New Project</h1>
      <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '24px' }}>
        Describe your project so students can bid on it
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Build a landing page for my bakery" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the project in detail..." required rows={5} />
          </div>
          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <input type="text" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="e.g. React, Figma, SEO" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Min Budget ($)</label>
              <input type="number" name="budgetMin" value={form.budgetMin} onChange={handleChange} placeholder="100" required min="1" />
            </div>
            <div className="form-group">
              <label>Max Budget ($)</label>
              <input type="number" name="budgetMax" value={form.budgetMax} onChange={handleChange} placeholder="500" required min="1" />
            </div>
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Post Project'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;
