import React, { useState } from 'react';
import { Container, CssBaseline, Typography, TextField, Button, Box, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE =
  (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.replace(/\/+$/, '')) ||
  'https://backend.globaljournal.co.in';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [resultType, setResultType] = useState(''); // 'success' | 'error'
  const navigate = useNavigate();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setResultMessage('');
    setResultType('');
    setLoading(true);
  
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
  
    while (attempts < maxAttempts && !success) {
      try {
        const url = `${API_BASE}/reset.php?action=request`;
       // console.log('POST', url);
        const response = await axios.post(
          url,
          { email },
          { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
        );
        //console.log('Response', response.data);
  
        if (response.data.success) {
          alert('A password reset link has been sent to your email.');
          setResultMessage(response.data.message || 'Reset email sent successfully.');
          setResultType('success');
          navigate('/login');
          success = true;
        } else {
        //  console.log('Attempt', attempts + 1, ':', response.data.message || 'Unknown error');
          setResultMessage(response.data.message || 'Failed to send reset email.');
          setResultType('error');
          attempts++;
          if (attempts >= maxAttempts) {
            alert('Something went wrong. Please try again later.');
          }
        }
      } catch (error) {
       // console.error('Attempt', attempts + 1, 'error:', error);
        setResultMessage('Network or server error while sending reset email.');
        setResultType('error');
        attempts++;
        if (attempts >= maxAttempts) {
          alert('Something went wrong. Please try again later.');
        }
      }
    }
    setLoading(false);
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
            disabled={loading || !email}
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </Button>
          {resultMessage && (
            <Typography
              variant="body2"
              sx={{ mb: 2, textAlign: 'center' }}
              color={resultType === 'success' ? 'success.main' : 'error.main'}
            >
              {resultMessage}
            </Typography>
          )}
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
