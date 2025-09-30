import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://backend.globaljournal.co.in'; // fallback
console.log('API_BASE_URL =', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,       // ✅ all relative paths will use the backend domain
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// (optional) If userToken is a JSON object (not a JWT), don't send it as Bearer
apiClient.interceptors.request.use((config) => {
  // If later you add a real JWT token, set it here:
  // const jwt = localStorage.getItem('jwt');
  // if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});

// Auth
const ApiService = {
  login: (credentials) => apiClient.post('/login.php', credentials),

  register: (userData) => apiClient.post('/register.php', userData),

  // generic JSON post helper (expects relative PHP path)
  post: (path, payload) =>
    apiClient.post(path.startsWith('/') ? path : `/${path}`, payload).then(res => res.data),

  getUserProfile: () => {
    const raw = localStorage.getItem('userToken');
    if (!raw) return Promise.reject(new Error('User not logged in'));

    let parsed;
    try { parsed = JSON.parse(raw); } catch { return Promise.reject(new Error('Invalid session. Please log in again.')); }

    const userId = parsed?.id;
    const email  = parsed?.email;
    const expiry = parsed?.expires_at ? new Date(parsed.expires_at) : null;
    if (expiry && new Date() > expiry) return Promise.reject(new Error('Token has expired. Please log in again.'));
    if (!userId && !email) return Promise.reject(new Error('Missing user id/email. Please log in again.'));

    const payload = userId ? { id: userId } : { email };

    return apiClient.post('/get_profile.php', payload)
      .then(({ data }) => {
        if (!data?.success) throw new Error(data?.message || 'Failed to fetch profile');
        return data.data; // return the user object
      })
      .catch((error) => {
        if (error.response) {
          const { status } = error.response;
          if (status === 401) throw new Error('Authentication failed. Please login again.');
          if (status === 404) throw new Error('User profile not found');
          if (status === 422) throw new Error('Profile request missing id/email. Please login again.');
        }
        throw error;
      });
  },

  submitSubmission: (submissionData) => apiClient.post('/title_submission.php', submissionData),
  updateUserProfile: (userData) => apiClient.put('/update_profile.php', userData),

  // --- keep or remove these if not used; ensure paths exist on PHP backend ---
  submitData: (data) => apiClient.post('/data/submit', data),
  getData: (params) => apiClient.get('/data', { params }),

  // file upload
  uploadFile: (formData) =>
    apiClient.post('/upload.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // uploads may take longer
      withCredentials: true // mirror previous fetch credentials
    }).then(res => res.data),

  // optional health check
  isServerRunning: async () => {
    try {
      const response = await apiClient.get('/'); // only works if backend root returns something
      return !!response;
    } catch (e) { return false; }
  }
};

export default ApiService;
