
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('ofppt_token');


const headers = (withAuth = true) => {
  const h = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};


const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || `Erreur ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
};


const request = async (method, path, body = null, auth = true) => {
  const options = {
    method,
    headers: headers(auth),
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${BASE_URL}${path}`, options);
  return handleResponse(response);
};


export const authAPI = {
  login: (email, password) => request('POST', '/api/auth/login', { email, password }, false),
  register: (data) => request('POST', '/api/auth/register', data, false),
  me: () => request('GET', '/api/auth/me'),
  logout: () => request('POST', '/api/auth/logout'),
};


export const usersAPI = {
  getAll: () => request('GET', '/api/users', null, false),
  create: (data) => request('POST', '/api/users', data, false),
  update: (id, data) => request('PUT', `/api/users/${id}`, data, false),
  delete: (id) => request('DELETE', `/api/users/${id}`, null, false),
};


export const intervenantsAPI = {
  getAll: () => request('GET', '/api/intervenants', null, false),
  getById: (id) => request('GET', `/api/intervenants/${id}`, null, false),
  create: (data) => request('POST', '/api/intervenants', data, false),
  update: (id, data) => request('PUT', `/api/intervenants/${id}`, data, false),
  delete: (id) => request('DELETE', `/api/intervenants/${id}`, null, false),
};


export const postulationsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/api/postulations${query ? '?' + query : ''}`, null, false);
  },
  create: (data) => request('POST', '/api/postulations', data, false),
  updateStatus: (id, statut) => request('PATCH', `/api/postulations/${id}`, { statut }, false),
};


export const themesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/api/themes${query ? '?' + query : ''}`, null, false);
  },
  getById: (id) => request('GET', `/api/themes/${id}`, null, false),
  create: (data) => request('POST', '/api/themes', data, false),
  update: (id, data) => request('PUT', `/api/themes/${id}`, data, false),
  delete: (id) => request('DELETE', `/api/themes/${id}`, null, false),
};


export const plansAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/api/plans${query ? '?' + query : ''}`, null, false);
  },
  getById: (id) => request('GET', `/api/plans/${id}`, null, false),
  create: (data) => request('POST', '/api/plans', data, false),
  update: (id, data) => request('PUT', `/api/plans/${id}`, data, false),
  delete: (id) => request('DELETE', `/api/plans/${id}`, null, false),
  affecter: (id, data) => request('PATCH', `/api/plans/${id}/affecter`, data, false),
  updateStatus: (id, statut) => request('PATCH', `/api/plans/${id}/status`, { statut }, false),
  getStats: () => request('GET', '/api/plans/stats/global', null, false),
};


export const notificationsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/api/notifications${query ? '?' + query : ''}`, null, false);
  },
  create: (data) => request('POST', '/api/notifications', data, false),
  markRead: (id) => request('PATCH', `/api/notifications/${id}/read`, {}, false),
  markAllRead: () => request('PATCH', '/api/notifications/read-all', {}, false),
  delete: (id) => request('DELETE', `/api/notifications/${id}`, null, false),
};

export default {
  auth: authAPI,
  users: usersAPI,
  intervenants: intervenantsAPI,
  postulations: postulationsAPI,
  themes: themesAPI,
  plans: plansAPI,
  notifications: notificationsAPI,
};
