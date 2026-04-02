const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5002';

export const API_URL = rawApiUrl.replace(/\/+$/, '');
export const API_BASE_URL = `${API_URL}/api`;
