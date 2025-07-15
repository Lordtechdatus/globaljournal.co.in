import React, { useState } from 'react';
import { Container, CssBaseline, Typography, TextField, Button, Box, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (event) => {
    event.preventDefault();
  
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
  
    while (attempts < maxAttempts && !success) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}reset.php?action=request`,
          { email }
        );
  
        if (response.data.success) {
          alert('A password reset link has been sent to your email if it exists in our system.');
          navigate('/login');
          success = true;
        } else {
          console.log('Attempt', attempts + 1, ':', response.data.message || 'Unknown error');
          attempts++;
          if (attempts >= maxAttempts) {
            alert('Something went wrong. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Attempt', attempts + 1, 'error:', error);
        attempts++;
        if (attempts >= maxAttempts) {
          alert('Something went wrong. Please try again later.');
        }
      }
    }
  };  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <LockOutlinedIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
            Reset Password
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        <Box component="form" noValidate onSubmit={handleResetPassword} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              fontWeight: 500,
            }}
          >
            Send Reset Link
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ 
              color: 'text.secondary',
              textTransform: 'none'
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
