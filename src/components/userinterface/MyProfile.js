import React, { useState, useEffect } from 'react';
import {
  Container, Box, Paper, Typography, Avatar, Grid, Divider, Button, 
  Card, CardContent, CircularProgress, Alert, Chip, Stack, Tabs, Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import ApiService from '../../Services/FetchNodeAdminServices';
import { useNavigate } from 'react-router-dom';
// Import the Submissions component
import Submissions from './Submissions';

// Animated components with Framer Motion
const MotionContainer = styled(motion.div)({
  width: '100%',
  overflow: 'hidden'
});

const MotionBox = styled(motion(Box))({});

const MotionCard = styled(motion(Card))(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'visible',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    transform: 'translateY(-5px)'
  }
}));

// Styled components
const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(5, 3),
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(37, 117, 252, 0.2)',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  marginBottom: theme.spacing(2),
  border: '5px solid rgba(255, 255, 255, 0.3)',
  backgroundColor: theme.palette.primary.main,
  fontSize: '4rem',
  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
}));

const ProfileSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  overflow: 'visible',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

const ProfileItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.02)',
  }
}));

const ProfileItemLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  minWidth: 150,
  color: '#555',
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
    color: theme.palette.primary.main,
  }
}));

const ProfileItemValue = styled(Typography)(({ theme }) => ({
  color: '#333',
  flex: 1,
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 120,
    transition: 'all 0.2s',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
}));

const ProfileBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '50px',
  padding: theme.spacing(0.5, 2),
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const AnimatedBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  overflow: 'hidden',
  '& .circle': {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
  }
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

// Country code mapping (ISO country name to phone code)
const countryPhoneCodes = {
  "Afghanistan": "+93",
  "Albania": "+355",
  "Algeria": "+213",
  "Andorra": "+376",
  "Angola": "+244",
  "Antigua & Deps": "+1",
  "Argentina": "+54",
  "Armenia": "+374",
  "Australia": "+61",
  "Austria": "+43",
  "Azerbaijan": "+994",
  "Bahamas": "+1",
  "Bahrain": "+973",
  "Bangladesh": "+880",
  "Barbados": "+1",
  "Belarus": "+375",
  "Belgium": "+32",
  "Belize": "+501",
  "Benin": "+229",
  "Bhutan": "+975",
  "Bolivia": "+591",
  "Bosnia Herzegovina": "+387",
  "Botswana": "+267",
  "Brazil": "+55",
  "Brunei": "+673",
  "Bulgaria": "+359",
  "Burkina": "+226",
  "Burundi": "+257",
  "Cambodia": "+855",
  "Cameroon": "+237",
  "Canada": "+1",
  "Cape Verde": "+238",
  "Central African Rep": "+236",
  "Chad": "+235",
  "Chile": "+56",
  "China": "+86",
  "Colombia": "+57",
  "Comoros": "+269",
  "Congo": "+242",
  "Congo {Democratic Rep}": "+243",
  "Costa Rica": "+506",
  "Croatia": "+385",
  "Cuba": "+53",
  "Cyprus": "+357",
  "Czech Republic": "+420",
  "Denmark": "+45",
  "Djibouti": "+253",
  "Dominica": "+1",
  "Dominican Republic": "+1",
  "East Timor": "+670",
  "Ecuador": "+593",
  "Egypt": "+20",
  "El Salvador": "+503",
  "Equatorial Guinea": "+240",
  "Eritrea": "+291",
  "Estonia": "+372",
  "Ethiopia": "+251",
  "Fiji": "+679",
  "Finland": "+358",
  "France": "+33",
  "Gabon": "+241",
  "Gambia": "+220",
  "Georgia": "+995",
  "Germany": "+49",
  "Ghana": "+233",
  "Greece": "+30",
  "Grenada": "+1",
  "Guatemala": "+502",
  "Guinea": "+224",
  "Guinea-Bissau": "+245",
  "Guyana": "+592",
  "Haiti": "+509",
  "Honduras": "+504",
  "Hungary": "+36",
  "Iceland": "+354",
  "India": "+91",
  "Indonesia": "+62",
  "Iran": "+98",
  "Iraq": "+964",
  "Ireland {Republic}": "+353",
  "Israel": "+972",
  "Italy": "+39",
  "Ivory Coast": "+225",
  "Jamaica": "+1",
  "Japan": "+81",
  "Jordan": "+962",
  "Kazakhstan": "+7",
  "Kenya": "+254",
  "Kiribati": "+686",
  "Korea North": "+850",
  "Korea South": "+82",
  "Kosovo": "+383",
  "Kuwait": "+965",
  "Kyrgyzstan": "+996",
  "Laos": "+856",
  "Latvia": "+371",
  "Lebanon": "+961",
  "Lesotho": "+266",
  "Liberia": "+231",
  "Libya": "+218",
  "Liechtenstein": "+423",
  "Lithuania": "+370",
  "Luxembourg": "+352",
  "Macedonia": "+389",
  "Madagascar": "+261",
  "Malawi": "+265",
  "Malaysia": "+60",
  "Maldives": "+960",
  "Mali": "+223",
  "Malta": "+356",
  "Marshall Islands": "+692",
  "Mauritania": "+222",
  "Mauritius": "+230",
  "Mexico": "+52",
  "Micronesia": "+691",
  "Moldova": "+373",
  "Monaco": "+377",
  "Mongolia": "+976",
  "Montenegro": "+382",
  "Morocco": "+212",
  "Mozambique": "+258",
  "Myanmar, {Burma}": "+95",
  "Namibia": "+264",
  "Nauru": "+674",
  "Nepal": "+977",
  "Netherlands": "+31",
  "New Zealand": "+64",
  "Nicaragua": "+505",
  "Niger": "+227",
  "Nigeria": "+234",
  "Norway": "+47",
  "Oman": "+968",
  "Pakistan": "+92",
  "Palau": "+680",
  "Panama": "+507",
  "Papua New Guinea": "+675",
  "Paraguay": "+595",
  "Peru": "+51",
  "Philippines": "+63",
  "Poland": "+48",
  "Portugal": "+351",
  "Qatar": "+974",
  "Romania": "+40",
  "Russian Federation": "+7",
  "Rwanda": "+250",
  "St Kitts & Nevis": "+1",
  "St Lucia": "+1",
  "Saint Vincent & the Grenadines": "+1",
  "Samoa": "+685",
  "San Marino": "+378",
  "Sao Tome & Principe": "+239",
  "Saudi Arabia": "+966",
  "Senegal": "+221",
  "Serbia": "+381",
  "Seychelles": "+248",
  "Sierra Leone": "+232",
  "Singapore": "+65",
  "Slovakia": "+421",
  "Slovenia": "+386",
  "Solomon Islands": "+677",
  "Somalia": "+252",
  "South Africa": "+27",
  "South Sudan": "+211",
  "Spain": "+34",
  "Sri Lanka": "+94",
  "Sudan": "+249",
  "Suriname": "+597",
  "Swaziland": "+268",
  "Sweden": "+46",
  "Switzerland": "+41",
  "Syria": "+963",
  "Taiwan": "+886",
  "Tajikistan": "+992",
  "Tanzania": "+255",
  "Thailand": "+66",
  "Togo": "+228",
  "Tonga": "+676",
  "Trinidad & Tobago": "+1",
  "Tunisia": "+216",
  "Turkey": "+90",
  "Turkmenistan": "+993",
  "Tuvalu": "+688",
  "Uganda": "+256",
  "Ukraine": "+380",
  "United Arab Emirates": "+971",
  "United Kingdom": "+44",
  "United States": "+1",
  "Uruguay": "+598",
  "Uzbekistan": "+998",
  "Vanuatu": "+678",
  "Vatican City": "+39",
  "Venezuela": "+58",
  "Vietnam": "+84",
  "Yemen": "+967",
  "Zambia": "+260",
  "Zimbabwe": "+263"
};

export default function MyProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Retry function
    const attemptFetchProfile = async (retryCount = 0) => {
      try {
        setLoading(true);
        const server = await ApiService.getUserProfile(); // returns the user object

if (server) {
  const transformedData = {
    givenName: server.firstName || server.givenName || server.name?.split(' ')[0] || '',
    familyName: server.lastName || server.familyName || server.name?.split(' ').slice(1).join(' ') || '',
    email: server.email || '',
    username: server.username || '',
    affiliation: server.affiliation || '',
    country: server.country || '',
    phonenumber: server.phonenumber || server.phone || '',
    orcidId: server.orcidId || server.orcid_id || '',
    areasOfInterest: Array.isArray(server.researchInterests)
      ? server.researchInterests
      : Array.isArray(server.areasOfInterest)
      ? server.areasOfInterest
      : typeof server.areas_of_interest === 'string'
      ? server.areas_of_interest.split(',').map(s => s.trim()).filter(Boolean)
      : [],
    joinedDate: server.createdAt || server.created_at || ''
  };
 // console.log('Transformed profile data:', transformedData);
  setProfileData(transformedData);
  setLoading(false);
} else {
  setError('No profile data returned from server');
  setLoading(false);
}

} catch (err) {
  if (retryCount < 2) {
    attemptFetchProfile(retryCount + 1);
    return;
  }
  if (err.response?.status === 401 || err.response?.status === 403 || err.message?.includes('login again')) {
    localStorage.removeItem('userToken');
    setError('Authentication failed. Please login again.');
    setTimeout(() => navigate('/login'), 1500);
  } else if (err.response?.status === 422) {
    setError('Profile request missing id/email. Please login again.');
    localStorage.removeItem('userToken');
    setTimeout(() => navigate('/login'), 1500);
  } else if (err.code === 'ERR_NETWORK') {
    setError('Unable to connect to the server. Please check if the backend is running.');
  } else {
    setError(err.response?.data?.message || err.message || 'Failed to load profile data');
  }
  setLoading(false);  
          setTimeout(() => {
            navigate('/login'); // Redirect to login page after showing the message
          }, 3000); // Redirect after 3 seconds
          
      }
    };
  
    attemptFetchProfile(); // Start the first attempt
  }, [navigate]);  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle when profile is still loading
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CircularProgress size={60} thickness={4} />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography variant="h6" sx={{ mt: 3 }}>Loading your profile...</Typography>
          </motion.div>
        </Box>
      </Container>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="error" sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 'medium' }}>{error}</Alert>
          {error.includes('Authentication failed') ? (
            <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
              Go to Login
            </Button>
          ) : (
            <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
              Back to Home
            </Button>
          )}
        </motion.div>
      </Container>
    );
  }

  // Get the actual profile data or use fallback
  const userProfile = profileData || {
    givenName: '',
    familyName: '',
    email: '',
    username: '',
    affiliation: '',
    country: '',
    phonenumber: '',
    orcidId: '',
    areasOfInterest: [],
    joinedDate: ''
  };

  // Check if we're using placeholder or real data
  const isPlaceholder = !profileData;

  // Format joined date
  const formattedJoinedDate = userProfile.joinedDate 
    ? new Date(userProfile.joinedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not available';

  // Format phone number with country code
  const getFormattedPhoneNumber = () => {
    if (!userProfile.phonenumber || !userProfile.country) {
      return 'Not specified';
    }
    
    const countryCode = countryPhoneCodes[userProfile.country] || '';
    const phoneNumber = userProfile.phonenumber;
    
    // Format: +XX XXXXXXXXXX
    return `${countryCode} ${phoneNumber}`;
  };

  return (
    <MotionContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Container maxWidth="md" sx={{ py: 6 }}>
        <MotionBox variants={itemVariants}>
          <ProfileHeader>
            <AnimatedBackground>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="circle"
                  initial={{
                    x: Math.random() * 100 - 50 + '%',
                    y: Math.random() * 100 - 50 + '%',
                    opacity: 0.1 + Math.random() * 0.2,
                    scale: 0.5 + Math.random() * 1.5
                  }}
                  animate={{
                    x: [
                      Math.random() * 100 - 50 + '%',
                      Math.random() * 100 - 50 + '%',
                      Math.random() * 100 - 50 + '%'
                    ],
                    y: [
                      Math.random() * 100 - 50 + '%',
                      Math.random() * 100 - 50 + '%',
                      Math.random() * 100 - 50 + '%'
                    ],
                  }}
                  transition={{
                    duration: 15 + Math.random() * 15,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  style={{
                    width: (50 + Math.random() * 100) + 'px',
                    height: (50 + Math.random() * 100) + 'px',
                  }}
                />
              ))}
            </AnimatedBackground>
            
            <ProfileBadge>
              <BadgeIcon fontSize="small" />
              <Typography variant="body2">Member</Typography>
            </ProfileBadge>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <ProfileAvatar>
                {userProfile.givenName ? userProfile.givenName.charAt(0) : ''}
                {userProfile.familyName ? userProfile.familyName.charAt(0) : ''}
              </ProfileAvatar>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
                {`${userProfile.givenName || ''} ${userProfile.familyName || ''}`.trim() || 'No name provided'}
              </Typography>
            </motion.div>
            
            {userProfile.username && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 2 }}>
                  @{userProfile.username}
                </Typography>
              </motion.div>
            )}
            
            {userProfile.joinedDate && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Chip 
                  label={`Joined: ${formattedJoinedDate}`}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    backdropFilter: 'blur(5px)'
                  }} 
                />
              </motion.div>
            )}
            
            {isPlaceholder && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
                  Your profile data could not be loaded. Please check your connection to the backend.
                </Alert>
              </motion.div>
            )}
          </ProfileHeader>
        </MotionBox>

        {/* Profile Tabs */}
        <MotionBox variants={itemVariants}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <StyledTabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              centered
              sx={{ mb: 1 }}
            >
              <Tab 
                label="Profile Information" 
                icon={<AccountCircleIcon />} 
                iconPosition="start"
              />
              <Tab 
                label="My Submissions" 
                icon={<AssignmentIcon />}
                iconPosition="start"
              />
            </StyledTabs>
          </Box>
        </MotionBox>

        {/* Profile Information Tab */}
        {activeTab === 0 && (
          <MotionContainer
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MotionCard variants={itemVariants}>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle>
                  <PersonIcon />
                  Personal Information
                </SectionTitle>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ProfileItem>
                      <ProfileItemLabel>
                        <PersonIcon />
                        Full Name:
                      </ProfileItemLabel>
                      <ProfileItemValue>
                        {`${userProfile.givenName || ''} ${userProfile.familyName || ''}`.trim() || 'Not specified'}
                      </ProfileItemValue>
                    </ProfileItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProfileItem>
                      <ProfileItemLabel>
                        <BadgeIcon />
                        Username:
                      </ProfileItemLabel>
                      <ProfileItemValue>{userProfile.username || 'Not specified'}</ProfileItemValue>
                    </ProfileItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProfileItem>
                      <ProfileItemLabel>
                        <EmailIcon />
                        Email:
                      </ProfileItemLabel>
                      <ProfileItemValue>{userProfile.email || 'Not specified'}</ProfileItemValue>
                    </ProfileItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProfileItem>
                      <ProfileItemLabel>
                        <PhoneIcon fontSize="small" />
                        Phone:
                      </ProfileItemLabel>
                      <ProfileItemValue>
                        <Chip 
                          label={getFormattedPhoneNumber()}
                          sx={{ 
                            fontWeight: 'medium',
                            fontSize: '0.9rem',
                            '& .MuiChip-icon': { color: 'primary.main', fontWeight: 'bold', fontSize: '1.2rem' }
                          }}
                        />
                      </ProfileItemValue>
                    </ProfileItem>
                  </Grid>
                </Grid>
              </CardContent>
            </MotionCard>

            <MotionCard variants={itemVariants}>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle>
                  <SchoolIcon />
                  Academic Information
                </SectionTitle>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ProfileItem>
                      <ProfileItemLabel>
                        <BusinessIcon />
                        Affiliation:
                      </ProfileItemLabel>
                      <ProfileItemValue>{userProfile.affiliation || 'Not specified'}</ProfileItemValue>
                    </ProfileItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProfileItem>
                      <ProfileItemLabel>
                        <LocationOnIcon />
                        Country:
                      </ProfileItemLabel>
                      <ProfileItemValue>{userProfile.country || 'Not specified'}</ProfileItemValue>
                    </ProfileItem>
                  </Grid>
                  <Grid item xs={12}>
                    <ProfileItem>
                      <ProfileItemLabel>
                        <BadgeIcon />
                        ORCID ID:
                      </ProfileItemLabel>
                      <ProfileItemValue>{userProfile.orcidId || 'Not specified'}</ProfileItemValue>
                    </ProfileItem>
                  </Grid>
                  <Grid item xs={12}>
                    <ProfileItem>
                      <ProfileItemLabel>
                        <SchoolIcon />
                        Research Interests:
                      </ProfileItemLabel>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {userProfile.areasOfInterest && userProfile.areasOfInterest.length > 0
                          ? (Array.isArray(userProfile.areasOfInterest)
                              ? userProfile.areasOfInterest.map((interest, index) => (
                                  <Chip 
                                    key={index} 
                                    label={interest} 
                                    color="primary" 
                                    variant="outlined" 
                                    size="small"
                                    sx={{ m: 0.5 }}
                                  />
                                ))
                              : userProfile.areasOfInterest)
                          : 'Not specified'}
                      </Box>
                    </ProfileItem>
                  </Grid>
                </Grid>
              </CardContent>
            </MotionCard>
          </MotionContainer>
        )}

        {/* Submissions Tab */}
        {activeTab === 1 && (
          <MotionBox
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <ProfileSection>
              <CardContent sx={{ p: 0 }}>
                <Submissions isEmbedded={true} />
              </CardContent>
            </ProfileSection>
          </MotionBox>
        )}

        <MotionBox 
          variants={itemVariants}
          sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/')}
              sx={{ 
                cursor: 'pointer',
                borderRadius: '30px',
                px: 3,
                py: 1,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
              startIcon={<PublicIcon />}
            >
              Back to Home
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/edit-profile')}
              sx={{ 
                cursor: 'pointer',
                borderRadius: '30px',
                px: 3,
                py: 1,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
              startIcon={<PersonIcon />}
            >
              Edit Profile
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained" 
              color="success"
              onClick={() => navigate('/titlesubmission')}
              sx={{ 
                cursor: 'pointer',
                borderRadius: '30px',
                px: 3,
                py: 1,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
              startIcon={<AssignmentIcon />}
            >
              Make a Submission
            </Button>
          </motion.div>
        </MotionBox>
      </Container>
    </MotionContainer>
  );
} 