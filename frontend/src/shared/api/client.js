const API_BASE_URL =
  (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 'http://localhost:8000';

const buildUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const get = (path) => request(path);

export const post = (path, payload) =>
  request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
