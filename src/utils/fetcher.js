import Axios from 'axios';

const fetcher = Axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
  },
});

fetcher.interceptors.response.use((resp) => {
  if (resp.status >= 200 && resp.status <= 300) {
    return resp.data;
  }
  const error = {
    message: resp.data?.message || 'Server failed.',
  };
  return Promise.reject(error);
}, (err) => {
  const error = {
    ...err,
    message: err?.response?.data?.message || err?.message || 'Server error',
  };
  throw error;
});

export default fetcher;
