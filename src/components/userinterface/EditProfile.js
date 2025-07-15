import React, { useState, useEffect } from 'react';
import {
  Container, Box, Paper, Typography, TextField, Button, 
  Grid, Divider, Alert, CircularProgress, Stack, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ApiService from '../../Services/FetchNodeAdminServices';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    givenName: '',
    familyName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Validation state
  const [formErrors, setFormErrors] = useState({
    givenName: '',
    familyName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }
  
    // Retry function to fetch profile data
    const attemptFetchProfile = async (retryCount = 0) => {
      try {
        setLoading(true);
        const response = await ApiService.getUserProfile();
  
        if (response.data) {
          setFormData({
            givenName: response.data.firstName || response.data.givenName || response.data.name?.split(' ')[0] || '',
            familyName: response.data.lastName || response.data.familyName || response.data.name?.split(' ').slice(1).join(' ') || '',
            email: response.data.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          setError('No profile data returned from server');
        }
        setLoading(false);
      } catch (err) {
        // If retryCount is less than 2, try again
        if (retryCount < 2) {
          console.log(`Retrying... Attempt ${retryCount + 1}`);
          attemptFetchProfile(retryCount + 1); // Retry the request
        } else {
          // After 3 failed attempts (0, 1, 2 retries)
          handleFetchError(err);
          setLoading(false);
          setTimeout(() => {
            navigate('/login'); // Redirect to login page after showing the message
          }, 3000); // Redirect after 3 seconds
        }
      }
    };
  
    // Error handling function
    const handleFetchError = (err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('userToken'); // Clear invalid token
        setError('Authentication failed. Please login again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check if the backend is running.');
      } else if (err.message) {
        setError(err.message);
      } else if (err.response) {
        setError(err.response.data?.message || 'Failed to load profile data');
      } else {
        setError('Failed to load profile data after multiple attempts. Please try again later.');
      }
    };
  
    attemptFetchProfile(); // Start the first attempt
  }, [navigate]);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate name fields (optional but can't be just spaces)
    if (formData.givenName.trim() === '' && formData.givenName !== '') {
      errors.givenName = 'Name cannot be just spaces';
      isValid = false;
    }

    if (formData.familyName.trim() === '' && formData.familyName !== '') {
      errors.familyName = 'Family name cannot be just spaces';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Only validate password fields if the user is trying to change password
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      // Current password is required if changing password
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to set a new password';
        isValid = false;
      }
      
      // New password must be at least 6 characters
      if (formData.newPassword && formData.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      // Passwords must match
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e, retryCount = 0) => {
    e.preventDefault();
  
    // Reset any previous error/success states
    setError(null);
    setSuccess(null);
  
    // Validate form
    if (!validateForm()) {
      return;
    }
  
    // Get userId from localStorage
    const userToken = JSON.parse(localStorage.getItem('userToken'));
    if (!userToken) {
      setError('User is not logged in');
      return;
    }
    const userId = userToken.id; // Extracting userId from token stored in localStorage
  
    // Prepare data for the API
    const updateData = {
      user_id: userId,
      name: `${formData.givenName} ${formData.familyName}`,
      email: formData.email
    };
  
    // Only include password fields if the user is changing password
    if (formData.currentPassword && formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }
  
    try {
      setSaveLoading(true);
      const response = await ApiService.updateUserProfile(updateData);
  
      if (response.data && response.data.success) {
        setSuccess('Profile updated successfully');
  
        // Clear password fields after successful update
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSaveLoading(false);
      } else {
        // If data.success is false, retry the request up to 2 times
        if (retryCount < 2) {
          alert(`Attempt ${retryCount + 1} failed. Retrying...`);
          handleSubmit(e, retryCount + 1); // Retry the request
        } else {
          setError(response.data?.message || 'Failed to update profile after multiple attempts');
          setSaveLoading(false);
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
  
      // Retry logic if there is an error
      if (retryCount < 2) {
        alert(`Attempt ${retryCount + 1} failed due to error. Retrying...`);
        handleSubmit(e, retryCount + 1); // Retry the request
      } else {
        // After 3 failed attempts (0, 1, 2 retries)
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Failed to update profile. Please try again later.');
        }
        setSaveLoading(false);
      }
    }
  };
  


  // Handle when profile is still loading
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: isMobile ? 3 : 6 }}>
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" 
          sx={{ fontSize: isMobile ? '1.75rem' : '2.125rem' }}>
          Edit Profile
        </Typography>
        <Divider sx={{ mb: isMobile ? 2 : 4 }} />
        
        {error && <Alert severity="error" sx={{ mb: isMobile ? 2 : 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: isMobile ? 2 : 3 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={isMobile ? 2 : 3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom
                sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="givenName"
                value={formData.givenName}
                onChange={handleInputChange}
                error={!!formErrors.givenName}
                helperText={formErrors.givenName}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                error={!!formErrors.familyName}
                helperText={formErrors.familyName}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            
            {/* Password Section */}
            <Grid item xs={12} sx={{ mt: isMobile ? 1 : 2 }}>
              <Typography variant="h6" color="primary" gutterBottom
                sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                Change Password (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom
                sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                Leave these fields blank if you don't want to change your password
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={!!formErrors.currentPassword}
                helperText={formErrors.currentPassword}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={!!formErrors.newPassword}
                helperText={formErrors.newPassword || "Password must be at least 6 characters"}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center', 
            gap: isMobile ? 1 : 2, 
            mt: isMobile ? 3 : 5
          }}>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => navigate('/profile')}
              disabled={saveLoading}
              fullWidth={isMobile}
              sx={{ mb: isMobile ? 1 : 0 }}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              variant="contained" 
              color="primary"
              disabled={saveLoading}
              fullWidth={isMobile}
            >
              {saveLoading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 