import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE =
  (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.replace(/\/+$/, '')) ||
  'https://backend.globaljournal.co.in';

export default function SetNewPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    const t = searchParams.get('token');
    if (!t) {
      navigate('/login');
      return;
    }
    setToken(t);

    (async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/reset.php?action=verify&token=${encodeURIComponent(t)}`,
          { headers: { Accept: 'application/json' } }
        );
        if (!res.data?.success) throw new Error('Invalid or expired link.');
      } catch (e) {
        alert('Invalid or expired link.');
        navigate('/login');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // don't include navigate to avoid unnecessary reruns

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    const pass = password.trim();
    const confirm = confirmPassword.trim();

    if (pass !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (pass.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (!token) {
      setErrorMsg('Missing token. Please use the link from your email again.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/reset.php?action=reset`,
        { token, password: pass },
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );

      if (response.data?.success) {
        alert('Password reset successful.');
        navigate('/login');
      } else {
        setErrorMsg(response.data?.message || 'Reset failed. Please try again.');
      }
    } catch (err) {
      // Try to show server message if available
      const serverMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Network or server error while resetting password.';
      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    !loading &&
    password.length >= 8 &&
    confirmPassword.length >= 8 &&
    password === confirmPassword;

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

        {errorMsg && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="New Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Confirm Password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText={
              password && confirmPassword && password !== confirmPassword
                ? 'Passwords do not match.'
                : 'Minimum 8 characters.'
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 500 }}
            disabled={!canSubmit}
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </Button>
          <Button variant="text" fullWidth onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
