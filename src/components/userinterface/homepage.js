import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CardMedia from '@mui/material/CardMedia';
import Article from '@mui/icons-material/Article';
import Description from '@mui/icons-material/Description';
import Copyright from '@mui/icons-material/Copyright';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import ArrowForward from '@mui/icons-material/ArrowForward';

import { styled, alpha } from '@mui/material/styles';
import { isLoggedIn } from '../../utils/authUtils';

// Custom animation styles
const anim = {
  fadeIn: { animation: 'fadeIn 0.8s', '@keyframes fadeIn': { '0%': { opacity: 0 }, '100%': { opacity: 1 } } },
  slideDown: { animation: 'slideDown 0.5s', '@keyframes slideDown': { '0%': { opacity: 0, transform: 'translateY(-20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } } },
  slideUp: { animation: 'slideUp 0.8s', '@keyframes slideUp': { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } } },
  slideRight: { animation: 'slideRight 0.8s', '@keyframes slideRight': { '0%': { opacity: 0, transform: 'translateX(-20px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } } },
  slideLeft: { animation: 'slideLeft 0.8s', '@keyframes slideLeft': { '0%': { opacity: 0, transform: 'translateX(20px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } } }
};

// ======== START: STYLED HEADER COMPONENT ========
// This section contains the modern header styling based on Header.jsx
const SAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow:'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  transition: 'background-color 0.3s',
  position: 'static', width: '100%', zIndex: 1100,
}));

const SAppBarScrolled = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  borderBottom: 'none',
  transition: 'all 0.3s',
  position: 'static', width: '100%', zIndex: 1100,
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", serif',
  letterSpacing: '0.03em',
  fontWeight: 700,
  fontSize: '1.7rem',
  color: '#1a1a1a',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-4px',
    left: '0',
    width: '30px',
    height: '2px',
    backgroundColor: '#d32f2f',
  }
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '40px',
  backgroundColor: alpha(theme.palette.common.black, 0.03),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '260px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: 'all 0.2s ease-in-out',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.black, 0.4),
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    fontSize: '0.9rem',
  },
}));

const SBtn = styled(Button)(({ theme, active }) => ({
  color: active ? '#d32f2f' : '#333',
  fontWeight: active ? 600 : 500,
  padding: '8px 16px',
  textTransform: 'none',
  fontSize: '0.95rem',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'transparent',
    '&::after': {
      width: '70%',
      opacity: 1,
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: active ? '70%' : '0%',
    height: '2px',
    backgroundColor: '#d32f2f',
    transition: 'all 0.2s ease-in-out',
    opacity: active ? 1 : 0,
  }
}));
// ======== END: STYLED HEADER COMPONENT ========//

// Hero section with background image
const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 4,
        mb: 6,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        ...anim.fadeIn
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))',
          zIndex: 1
        }}
      />
      <Box
        component="img"
        src="/Construction.webp"
        //  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        alt="Construction Management"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.1)',
          animation: 'zoomSlow 30s infinite alternate ease-in-out',
          '@keyframes zoomSlow': {
            '0%': { transform: 'scale(1.0)' },
            '100%': { transform: 'scale(1.2)' }
          }
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ maxWidth: 600 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '3.1rem',
              mb: 2,
              ...anim.slideDown
            }}
          >
            Global Journal of Construction Management and Engineering
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.85)', 
              fontSize: '0.9rem',
              mb: 4,
              ...anim.slideRight,
              animationDelay: '200ms'
            }}
          >
            Advancing knowledge and innovation in construction management and engineering
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            component={Link} 
            to="/submissions"
            endIcon={<ArrowForward />}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontWeight: 600,
              ...anim.slideUp,
              animationDelay: '400ms'
            }}
          >
            Submit Your Research
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const MainContent = () => {
  const navigate = useNavigate();
  
  return (
    <Box 
      sx={{ ...anim.slideUp, animationDelay: '300ms' }}
      component={Paper} 
      elevation={2} 
      style={{ padding: 32, borderRadius: 8 }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        color="primary"
        sx={{ 
          fontWeight: 700, 
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: -5,
            height: 4,
            width: 120,
            backgroundColor: '#FFD700',
          }
        }}
      >
        Aims and scope
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}>
        The Global Journal of Construction Management and Engineering (GJCME) serves as a premier scholarly platform for advancing knowledge in the fields of construction management and engineering. Our mission is to foster rigorous research and critical discourse in these domains, providing a forum for high-quality original research papers, case studies, and reviews that contribute to both disciplines and their sub-disciplines.
      </Typography>
      
      <Typography variant="h4" component="h2" gutterBottom color="primary" sx={{ fontWeight: 600, mt: 4 }}>
        Scope and Coverage
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
        GJCME publishes original research that advances the understanding and practice of construction management and engineering. We welcome submissions that demonstrate academic rigor, practical relevance, and contribute to the advancement of knowledge in these fields.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card 
            raised 
            sx={{ 
              height: '100%', 
              borderTop: '4px solid #3f51b5',
              ...anim.slideRight,
              animationDelay: '500ms',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Construction Management"
            />
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                Management Studies
              </Typography>
              <List>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Organizational behavior, strategic management, and leadership in construction" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Human resource management, marketing, and operations in construction projects" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Entrepreneurship, innovation, and business ethics in construction" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Project management, supply chain, and technology management" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            raised 
            sx={{ 
              height: '100%', 
              borderTop: '4px solid #f50057',
              ...anim.slideRight,
              animationDelay: '700ms',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Engineering Studies"
            />
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                Engineering Studies
              </Typography>
              <List>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Construction materials and methods" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Structural engineering and design" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Geotechnical and environmental engineering" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Construction safety and risk management" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            raised 
            sx={{ 
              height: '100%', 
              borderTop: '4px solid #4caf50',
              ...anim.slideRight,
              animationDelay: '900ms',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image="https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Interdisciplinary Research"
            />
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                Interdisciplinary Research
              </Typography>
              <List>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Integration of management and engineering practices" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Innovative construction technologies and methodologies" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Sustainable construction and green building practices" />
                </ListItem>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText primary="Digital transformation in construction" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5, p: 4, bgcolor: '#f8f9fa', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
          alt="Publication Background"
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.15,
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%'
          }}
        />
        <Typography variant="h4" component="h2" gutterBottom color="primary" sx={{ fontWeight: 600, position: 'relative', zIndex: 1 }}>
          Publication Information
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1, position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="h3" gutterBottom color="textSecondary">
              Publication Frequency
            </Typography>
            <Typography variant="body1">
              Four volumes per year (March, June, October and December)
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="h3" gutterBottom color="textSecondary">
              Language
            </Typography>
            <Typography variant="body1">
              English
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="h3" gutterBottom color="textSecondary">
              Open Access Policy
            </Typography>
            <Typography variant="body1">
              We follow a full open access policy with no submission or publication fees, ensuring free and unrestricted access to all published content.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      {/* New Upcoming Articles Section */}
      <Box 
        sx={{ 
          mt: 5, 
          ...anim.slideUp, 
          animationDelay: '500ms',
          position: 'relative',
          overflow: 'hidden' 
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          color="primary" 
          sx={{ 
            fontWeight: 600,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: -5,
              height: 4,
              width: 100,
              backgroundColor: '#FFD700',
            }
          }}
        >
          Upcoming Articles
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                overflow: 'hidden',
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }
              }}
            > 
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="textSecondary">
                  Upcoming Article 1
                </Typography>
                <Typography variant="body1">
                  This is the first upcoming article. It will be published in the upcoming issue.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const Sidebar = () => {
  return (
    <Box sx={{ ...anim.slideLeft, animationDelay: '400ms' }}>
      <Card elevation={3} sx={{ 
        mb: 4, 
        overflow: 'visible', 
        borderRadius: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1507608158173-1dcec673a2e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          borderRadius: 2,
          zIndex: 0
        }
      }}>
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1E3A8A' }}>
            Journal Information
          </Typography>
          
          <Box sx={{ 
            height: 4, 
            width: 120, 
            bgcolor: '#FFD700', 
            mb: 3, 
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}></Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3, 
            p: 2, 
            bgcolor: '#f5f7fa', 
            borderRadius: 2 
          }}>
            <Box 
              component="img" 
              src="/Cover.webp" 
              alt="Journal Cover" 
              loading="lazy"
              sx={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: 1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }} 
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ mb: 1.5 }}>
              <Box component="span" sx={{ fontWeight: 600, color: '#1E3A8A', mr: 1 }}>ISSN:</Box>
              0975 9972
            </Typography>
            
            <Typography>
              <Box component="span" sx={{ fontWeight: 600, color: '#1E3A8A', mr: 1 }}>Editor-in-Chief:</Box>
              Dr. Rajeev Kansal
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      <Card elevation={3} sx={{ 
        borderRadius: 2,
        backgroundImage: 'linear-gradient(to right bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.98)), url(https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1E3A8A' }}>
            Author Resources
          </Typography>
          
          <Box sx={{ 
            height: 4, 
            width: 120, 
            bgcolor: '#FFD700', 
            mb: 3, 
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}></Box>
          
          <List>
            <ListItem 
              button 
              component={Link} 
              to="/AuthorGuidelines"
              sx={{
                borderRadius: 1,
                mb: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f0f4fa',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <Article sx={{ mr: 2, color: '#1E3A8A' }} />
              <ListItemText primary="Author Guidelines" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/SubmissionTemplate"
              sx={{
                borderRadius: 1,
                mb: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f0f4fa',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <Description sx={{ mr: 2, color: '#1E3A8A' }} />
              <ListItemText primary="Submission Template" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/ResearchEthicsGuidelines"
              sx={{
                borderRadius: 1,
                mb: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f0f4fa',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <VerifiedUser sx={{ mr: 2, color: '#1E3A8A' }} />
              <ListItemText primary="Research Ethics Guidelines" />
            </ListItem>
            
            <ListItem 
              button 
              component="a" 
              href="/copyright.pdf" 
              target="_blank"
              sx={{
                borderRadius: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f0f4fa',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <Copyright sx={{ mr: 2, color: '#1E3A8A' }} />
              <ListItemText primary="Copyright Form" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      {/* New Upcoming Issues Card */}
      <Card elevation={3} sx={{ 
        mt: 4,
        borderRadius: 2,
        overflow: 'hidden',
        ...anim.slideLeft,
        animationDelay: '600ms'
      }}>
        <CardMedia
          component="img"
          height="140"
          image="https://images.unsplash.com/photo-1586280268958-9483002d016a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          alt="Upcoming Issue"
          sx={{
            filter: 'brightness(0.85)'
          }}
        />
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1E3A8A' }}>
            Upcoming Issue
          </Typography>
          
          <Box sx={{ 
            height: 4, 
            width: 120, 
            bgcolor: '#FFD700', 
            mb: 3, 
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}></Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Volume 1, Issue 1 (June 2025)
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
            Our upcoming issue features research on sustainable construction, smart building technologies, and innovative project management methodologies.
          </Typography>
{/*           
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            bgcolor: 'rgba(30, 58, 138, 0.05)',
            p: 1.5,
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Submission Deadline:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>June 5, 2025</Typography>
          </Box> */}
          
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth
            component={Link}
            to="/submission-guidelines"
            sx={{ 
              mt: 1, 
              borderRadius: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            View Submission Guidelines
          </Button>
        </CardContent>
      </Card>
      
      {/* New Journal Metrics Card */}
      <Card elevation={3} sx={{ 
        mt: 4,
        borderRadius: 2,
        overflow: 'hidden',
        ...anim.slideLeft,
        animationDelay: '800ms'
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="120"
            image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="Journal Metrics"
            sx={{
              filter: 'brightness(0.7)'
            }}
          />
          <Typography
            variant="h5"
            component="h2"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              color: 'white',
              p: 2,
              fontWeight: 600,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
            }}
          >
            Journal Metrics
          </Typography>
        </Box>
        <CardContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(63, 81, 181, 0.08)', 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3f51b5', mb: 1 }}>
                -

                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Impact Factor
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(245, 0, 87, 0.08)', 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f50057', mb: 1 }}>
                  5
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Days to First Decision
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(76, 175, 80, 0.08)', 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                  -
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Citations in 2023
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(255, 152, 0, 0.08)', 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800', mb: 1 }}>
                    -
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Monthly Views
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#1E3A8A', 
        color: 'white', 
        mt: 6, 
        py: 4,
        boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        ...anim.fadeIn,
        animationDelay: '600ms'
      }}
    >
      <Box
        component="img"
        src="https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        alt="Footer Background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.08
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Global Journal of Construction Management and Engineering
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600, lineHeight: 1.8 }}>
              A premier scholarly platform for advancing knowledge in construction management and engineering, fostering rigorous research and critical discourse in these vital fields.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              <Link to="mailto:info@lordtechdatus.com" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Email: info@lordtechdatus.com
              </Link>
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
              Phone: +91 99817 56433
            </Typography>
            <Typography variant="body1">
              Address: G1, Akansha Apartment, Patel Nagar, City Centre, Gwalior, Near Raj Rajeshwari Apartment, 474002
            </Typography>
             {/* ✅ Admin Login Button here */}
            <Button
              variant="outlined"
              sx={{
              mt: 3,
              borderColor: 'white',
              color: 'white',
              '&:hover': {
              backgroundColor: 'white',
              color: '#1E3A8A',
      },
    }}
    component={Link}
    to="/adminlogin"
  >  Admin Login
  </Button>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          &copy; 2025 Global Journal of Construction Management and Engineering. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
const App = () => {
  return (
    <Box sx={{ ...anim.fadeIn }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <HeroSection />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <MainContent />
          </Grid>
          <Grid item xs={12} md={4}>
            <Sidebar />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default App;