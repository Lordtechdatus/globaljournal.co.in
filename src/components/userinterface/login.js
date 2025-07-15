import React, { useState } from 'react';
import { Container, CssBaseline, Avatar, Typography, TextField, Button, FormControlLabel, 
  Checkbox, Link, Grid, Box, Paper, IconButton, Divider, useMediaQuery, useTheme, Snackbar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../Services/FetchNodeAdminServices';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  },
}));

const AnimatedTextField = styled(motion.div)({
  width: '100%',
});

const AnimatedButton = styled(motion.div)({
  width: '100%',
});

const AnimatedAvatar = styled(motion(Avatar))(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  width: 56,
  height: 56,
}));

const BackgroundBox = styled(Box)({
  minHeight: '100vh',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
});

const BackgroundAnimation = styled(motion.div)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
});

const ContentBox = styled(Box)({
  position: 'relative',
  zIndex: 1,
  width: '100%',
});

export default function SignInPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' // 'success', 'error', 'warning', 'info'
  });

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({...notification, open: false});
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
  
    if (!email || !password) {
      showNotification('Please enter both email and password', 'warning');
      return;
    }
  
    // Show attempting login notification
    showNotification('Attempting to log in...', 'info');
    
    const attemptLogin = (retriesLeft) => {
      ApiService.login({ email, password })
        .then(response => {
          const data = response.data;
  
          if (data.success) {
            localStorage.setItem('userToken', JSON.stringify({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              expires_at: data.expires_at
            }));
  
            window.dispatchEvent(new Event('login'));
            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => navigate('/profile'), 1000);
          } else {
            if (retriesLeft > 0) {
              setTimeout(() => attemptLogin(retriesLeft - 1), 1000);
            } else {
              const errorMsg = data.message || '';
              let displayMsg = 'Login failed – please check your email and password.';
              
              if (errorMsg.includes('Invalid credentials')) {
                displayMsg = 'Login failed – please check your email and password.';
              } else {
                displayMsg = errorMsg || 'Login failed – please check your email and password.';
              }
              
              showNotification(displayMsg, 'error');
            }
          }
        })
        .catch(error => {
          if (retriesLeft > 0) {
            setTimeout(() => attemptLogin(retriesLeft - 1), 1000);
          } else {
            let displayMsg = '';
            
            if (error.code === 'ERR_NETWORK') {
              displayMsg = 'Unable to connect to the server. Please try again later.';
            } else if (error.response) {
              const errorMsg = error.response.data.message || '';
              displayMsg = 'Login failed – please check your email and password.';
              
              if (errorMsg.includes('Invalid credentials')) {
                displayMsg = 'Login failed – please check your email and password.';
              } else {
                displayMsg = errorMsg || 'Login failed – please check your email and password.';
              }
            } else {
              displayMsg = 'Something went wrong. Please try again.';
            }
            
            showNotification(displayMsg, 'error');
          }
        });
    };
  
    attemptLogin(2); // 3 attempts total: initial + 2 retries
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
      }
    }
  };

  const floatingBubbles = Array(6).fill().map((_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 100 + 50,
    duration: Math.random() * 10 + 10
  }));

  return (
    <BackgroundBox>
      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <BackgroundAnimation
        animate={{
          background: [
            'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
            'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {floatingBubbles.map((bubble, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </BackgroundAnimation>

      <ContentBox>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StyledPaper elevation={6}>
              <AnimatedAvatar
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <LockOutlinedIcon sx={{ fontSize: 32 }} />
              </AnimatedAvatar>
              
              <motion.div variants={itemVariants}>
                <Typography 
                  component="h1" 
                  variant="h5" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 600,
                    color: '#333333',
                    textAlign: 'center'
                  }}
                >
                  Welcome Back
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 3,
                    color: '#666666',
                    textAlign: 'center'
                  }}
                >
                  Sign in to access your Global Journal
                </Typography>
              </motion.div>
              
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                <AnimatedTextField variants={itemVariants}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </AnimatedTextField>
                
                <AnimatedTextField variants={itemVariants}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </AnimatedTextField>
                
                <motion.div variants={itemVariants}>
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                    sx={{ mt: 1 }}
                  />
                </motion.div>
                
                <AnimatedButton 
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                      background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </AnimatedButton>
                
                <motion.div variants={itemVariants}>
                  <Grid container>
                    <Grid item xs={12} sx={{ textAlign: 'center', mt: 1 }}>
                      <Link 
                        component="button" 
                        variant="body2" 
                        onClick={() => navigate('/reset-password')}
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        Forgot password?
                      </Link>
                    </Grid>
                  </Grid>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Not a member?
                    </Typography>
                    <AnimatedButton
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          py: 1.5,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 500,
                          borderRadius: '8px',
                          borderWidth: '2px',
                          '&:hover': {
                            borderWidth: '2px',
                          }
                        }}
                        onClick={() => navigate('/signup')}
                      >
                        Join Now
                      </Button>
                    </AnimatedButton>
                  </Box>
                </motion.div>
              </Box>
            </StyledPaper>
          </motion.div>
        </Container>
      </ContentBox>
    </BackgroundBox>
  );
}
