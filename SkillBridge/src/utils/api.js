const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Server error: Unable to parse response');
  }
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

const safeFetch = async (url, options) => {
  try {
    return await fetch(url, options);
  } catch (err) {
    throw new Error('Unable to connect to server. Please check if the backend is running.');
  }
};

const api = {
  get: async (endpoint) => {
    const res = await safeFetch(`${API_BASE}${endpoint}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  post: async (endpoint, body) => {
    const res = await safeFetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (endpoint, body) => {
    const res = await safeFetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  delete: async (endpoint) => {
    const res = await safeFetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

export default api;
