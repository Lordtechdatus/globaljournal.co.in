import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function SetNewPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = searchParams.get('token');
    if (!t) {
      navigate('/login');
    } else {
      setToken(t);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
  
    while (attempts < maxAttempts && !success) {
      try {
        const response = await axios.post(
          'https://backend.globaljournal.co.in/reset.php?action=reset',
          { token, password }
        );
  
        if (response.data.success) {
          alert('Password reset successful.');
          navigate('/login');
          success = true;
        } else {
          console.log(`Attempt ${attempts + 1} failed:`, response.data.message);
          attempts++;
          if (attempts >= maxAttempts) {
            alert('Reset failed. ' + (response.data.message || 'Please try again later.'));
          }
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} error:`, error);
        attempts++;
        if (attempts >= maxAttempts) {
          alert('Error resetting password. Please try again later.');
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
        <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
          Set New Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 500 }}
          >
            Reset Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
