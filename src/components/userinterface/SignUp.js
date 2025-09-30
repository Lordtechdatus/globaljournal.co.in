import React, { useState } from 'react';
import {
  Container, CssBaseline, Avatar, Typography, TextField, Button, Box, Paper, 
  FormControlLabel, Checkbox, Grid, InputAdornment, IconButton, Link, MenuItem, Autocomplete
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import logoImage from '../../assets/logo.png';
import backgroundImage from '../../assets/background.png';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  
  const countries = [
    "Select",   "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon",
    "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland",
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel",
    "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia",
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau",
    "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation",
    "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey",
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const institutions = [
    "Indian Institute of Technology Bombay",
    "Indian Institute of Technology Delhi",
    "Indian Institute of Technology Kanpur",
    "Indian Institute of Technology Madras",
    "Indian Institute of Technology Kharagpur",
    "National Institute of Technology Trichy",
    "National Institute of Technology Surathkal",
    "Delhi Technological University",
    "Birla Institute of Technology and Science, Pilani",
    "Vellore Institute of Technology",
    "Amity University",
    "Jawaharlal Nehru University",
    "University of Delhi",
    "Banaras Hindu University",
    "Aligarh Muslim University",
    "Jamia Millia Islamia",
    "Savitribai Phule Pune University",
    "Jadavpur University",
    "University of Hyderabad",
    "Manipal Academy of Higher Education",
    "Anna University",
    "SRM Institute of Science and Technology",
    "Lovely Professional University",
    "Shiv Nadar University",
    "Ashoka University",
    "Christ University",
    "Tata Institute of Social Sciences",
    "Indian Statistical Institute",
    "Indian Institute of Science, Bangalore",
    "Indian Institute of Management Ahmedabad",
    "Indian Institute of Management Bangalore",
    "Madhav Institute of Technology and Science "
  ];
  


  const [formData, setFormData] = useState({
    givenName: '',
    familyName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    affiliation: '',
    country: '',
    phonenumber:'',
    orcidId: '',
    areasOfInterest: '',
    agreeToPrivacy: false,
  });

  const [errors, setErrors] = useState({});

  // Handle Input Changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Validate form fields
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.givenName) {
      tempErrors.givenName = 'Required';
      isValid = false;
    }
    if (!formData.familyName) {
      tempErrors.familyName = 'Required';
      isValid = false;
    }
    if (!formData.affiliation) {
      tempErrors.affiliation = 'Required';
      isValid = false;
    }
    if (!formData.country) {
      tempErrors.country = 'Required';
      isValid = false;
    }
    if (!formData.phonenumber) {
      tempErrors.phonenumber = 'Required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phonenumber)) {
      tempErrors.phonenumber = 'Phone number must be exactly 10 digits';
      isValid = false;
    }
    
    if (!formData.email) {
      tempErrors.email = 'Required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (!formData.username) {
      tempErrors.username = 'Required';
      isValid = false;
    }
    if (!formData.password) {
      tempErrors.password = 'Required';
      isValid = false;
    } else if (formData.password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = 'Required';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    if (!formData.agreeToPrivacy) {
      tempErrors.agreeToPrivacy = 'You must agree to privacy policy';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Handle Form Submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    //console.log('Form submitted!');
    //console.log('Form data:', formData);
    
    const isValid = validateForm();
    //console.log('Form validation result:', isValid);
    //console.log('Current errors:', errors);
  
    if (isValid) {
      // Prepare data to send in the format expected by the backend
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: `${formData.givenName} ${formData.familyName}`.trim(),
        affiliation: formData.affiliation,
        country: formData.country,
        phonenumber:formData.phonenumber,
        orcidId: formData.orcidId || undefined, // Send undefined if empty
        areasOfInterest: formData.areasOfInterest || undefined, // Send undefined if empty
        agreeToPrivacy: formData.agreeToPrivacy
      };
      
      //console.log('Data to send:', dataToSend);
      //console.log('JSON stringified:', JSON.stringify(dataToSend));
  
    // Helper: fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }     
};

// Retry function
const attemptRequest = async (retryCount) => {  
  try {
    const response = await fetchWithTimeout('https://backend.globaljournal.co.in/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(dataToSend),
      mode: 'cors',
      // credentials: 'include', // only if your backend sets cookies
    }, 15000);

    // Parse body ONCE (try JSON, fallback to text for debugging)
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json().catch(() => ({})) : await response.text();

    if (!response.ok) {
      // Bubble up server message if provided
      const serverMsg = isJson && payload && payload.message ? payload.message : String(payload || '');
      throw new Error(serverMsg || `Server error: ${response.status}`);
    }

    // Success
    const data = isJson ? payload : {};
    alert('Account created successfully!');
    if (data.token) {
      localStorage.setItem('userToken', data.token);
      window.dispatchEvent(new Event('login'));
    }
    navigate('/login');

  } catch (err) {
    // Network errors / aborted / server message
    const msg = err?.message || 'Network error';
    alert(msg || 'Registration failed. Please try again.');
  }  
};
attemptRequest(0);
} else {
  //console.log('Form validation failed, not submitting');
  //console.log('Validation errors:', errors);
  alert('Please fix the form errors before submitting.');
}
}


  return (
    <Box
      sx={{
        padding: '20px 0',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ my: 4 }}>
        <CssBaseline />
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: 2,
            background: '#ffffff',
            overflow: 'hidden',
            height: 'auto',
          }}
        >
          {/* Left side with form */}
          <Box
            sx={{
              flex: { xs: '1', md: '0 0 60%' },
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              maxHeight: '800px',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: '#1976d2',
                  width: 56,
                  height: 56,
                }}
              >
                <PersonAddOutlinedIcon sx={{ fontSize: 32 }} />
              </Avatar>
              
              <Typography 
                component="h1" 
                variant="h5" 
                sx={{ 
                  mb: 1,
                  fontWeight: 500,
                  color: '#333333'
                }}
              >
                Create Account
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3,
                  color: '#666666',
                  textAlign: 'center' 
                }}
              >
                Join our academic community
              </Typography>
            </Box>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="First Name *"
                    name="givenName"
                    value={formData.givenName}
                    onChange={handleChange}
                    error={!!errors.givenName}
                    helperText={errors.givenName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name *"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleChange}
                    error={!!errors.familyName}
                    helperText={errors.familyName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email *"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Username *"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password *"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password *"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo
                    options={institutions}
                    value={formData.affiliation}
                    onChange={(event, newValue) => {
                      handleChange({
                        target: { name: 'affiliation', value: newValue || '' }
                      });
                    }}
                    onInputChange={(event, newInputValue) => {
                      handleChange({
                        target: { name: 'affiliation', value: newInputValue }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Affiliation / Institution *"
                        required
                        fullWidth
                        error={!!errors.affiliation}
                        helperText={errors.affiliation}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <React.Fragment>
                              <InputAdornment position="start">
                                <BusinessIcon color="primary" />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    required
                    fullWidth
                    label="Country *"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    error={!!errors.country}
                    helperText={errors.country}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PublicIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number *"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    error={!!errors.phonenumber}
                    helperText={errors.phonenumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ORCID ID (Optional)"
                    name="orcidId"
                    value={formData.orcidId}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Areas of Interest"
                    name="areasOfInterest"
                    value={formData.areasOfInterest}
                    onChange={handleChange}
                    placeholder="e.g., Machine Learning, Climate Science"
                    helperText="For reviewer/editor matching"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#666666', mt: 1, mb: 2, lineHeight: 1.5 }}>
                    By signing up, you agree to our privacy policy. Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.
                  </Typography>
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={formData.agreeToPrivacy}
                        onChange={handleChange}
                        name="agreeToPrivacy"
                        color="primary"
                      />
                    } 
                    label="Yes, I agree to have my data collected and stored according to the privacy statement."
                    sx={{ display: 'flex', alignItems: 'flex-start' }}
                  />
                  {errors.agreeToPrivacy && (
                    <Typography sx={{ color: 'error.main', fontSize: '0.8rem', mt: 1 }}>
                      {errors.agreeToPrivacy}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.95rem',
                  }}
                >
                  Sign Up
                </Button>
              </Box>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Already have an account?{' '}
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={() => navigate('/login')}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side with logo and image */}
          <Box
            sx={{
              flex: '0 0 40%',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              backgroundColor: '#f0f8ff',
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              minHeight: '800px',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(25, 118, 210, 0.7)',
                zIndex: 1,
              }}
            />
            
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <img 
                src={logoImage} 
                alt="Global Journal Logo" 
                style={{ 
                  maxWidth: '80%', 
                  height: 'auto', 
                  marginBottom: '2rem' 
                }} 
              />
              
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                Global Journal of Computer Science & Mathematics Education
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'white', 
                  textAlign: 'center',
                  mb: 4
                }}
              >
                Join our academic community and contribute to advancing knowledge in your field
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
