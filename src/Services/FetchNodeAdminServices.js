import axios from 'axios';

// Base URL of your backend API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log(API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000
});

// Add request interceptor for authorization headers
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service methods for different endpoints
const ApiService = {
  // Authentication methods
  login: (credentials) => {
    return apiClient.post('https://backend.globaljournal.co.in/login.php', credentials);
  },
  
  // Generic post method for any endpoint
  post: async (url, data) => {
    const response = await apiClient.post(url, data);
    return response.data;
  },
  
  register: (userData) => {
    return apiClient.post('register.php', userData);
  },

  submitSubmission: (submissionData) => {
    return apiClient.post('title_submission.php', submissionData);
  },
  
  // User data methods
  getUserProfile: () => {
    const userToken = localStorage.getItem('userToken');
      
        // Check if userToken exists
        if (!userToken) {
          return Promise.reject(new Error('User not logged in'));
        }
      
        const parsedToken = JSON.parse(userToken);
        const userId = parsedToken.id;
        const expiry = new Date(parsedToken.expires_at);
        const currentTime = new Date();
      
        // Check if the token has expired
        if (currentTime > expiry) {
          return Promise.reject(new Error('Token has expired. Please log in again.'));
        }
    // Make the API call to get user profile
    return apiClient.post('get_profile.php', { user_id: userId })
      .then(response => {
        if (response.data.success) {
          return response.data; // Successfully received user data
        } else {
          throw new Error(response.data.message || 'Failed to fetch profile');
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            throw new Error('Authentication failed. Please login again.');
          } else if (error.response.status === 404) {
            throw new Error('User profile not found');
          }
        }
        throw error; // Rethrow any other errors
      });
  },  
  
  updateUserProfile: (userData) => {
    return apiClient.put('update_profile.php', userData);
  },
  
  // Data submission method
  submitData: (data) => {
    return apiClient.post('/data/submit', data);
  },
  
  // Get data method
  getData: (params) => {
    return apiClient.get('/data', { params });
  },
  
  // Form submission method using the specific endpoint
  submitForm: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  // Alternative using axios
  submitFormAxios: (formData) => {
    return apiClient.post('/submit-form', formData);
  },
  
  // Connection check
  isServerRunning: async () => {
    try {
      const response = await apiClient.get('/');
      
      // Check if we got a valid response
      if (response.data && response.data.message === 'Backend server is running') {
        return true;
      }
      
      return false;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        return false;
      }
      if (error.response) {
        return true;
      }
      return false;
    }
  }
};

export default ApiService; 
