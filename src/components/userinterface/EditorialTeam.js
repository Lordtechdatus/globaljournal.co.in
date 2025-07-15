import React, { useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import './styles.css';

// Animation styles
const fadeIn = {
  animation: 'fadeIn 0.8s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
  }
};

const slideUp = {
  animation: 'slideUp 0.8s ease-in-out',
  '@keyframes slideUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  }
};

const MemberPaper = styled(Paper)(({ theme, delay = 0 }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '12px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
  animationName: 'fadeIn',
  animationDuration: '0.8s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

// Large avatar for editors
const EditorAvatar = styled(Avatar)(({ theme }) => ({
  width: 140,
  height: 140,
  marginBottom: theme.spacing(2),
  border: '4px solid #fff',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
}));

// Staggered animation for team members
const AnimatedBox = styled(Box)(({ theme, delay = 0 }) => ({
  animationName: 'slideUp',
  animationDuration: '0.8s',
  animationFillMode: 'both',
  animationDelay: `${delay}ms`,
}));

// Styled section title
const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  fontWeight: 600,
  marginBottom: theme.spacing(4),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '100%',
    height: '3px',
    background: 'linear-gradient(90deg, #1976d2, #6ab7ff)',
    borderRadius: '2px',
  }
}));

// Background wrapper with subtle pattern
const SectionWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(6),
  background: 'linear-gradient(145deg, #f6f8fb 0%, #e9f1f9 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
}));

const EditorialTeam = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Placeholder function to generate consistent avatars based on name
  const getAvatarUrl = (name) => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=256`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6, ...fadeIn }}>
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3"  
          gutterBottom 
          fontWeight={700} 
          sx={{ 
            animationName: 'slideDown',
            animationDuration: '0.5s',
            animationFillMode: 'both',
            background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Editorial Team
        </Typography>
        <Divider sx={{ width: '80px', mx: 'auto', borderWidth: '2px', borderColor: '#1976d2', mb: 3 }} />
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
          Meet our distinguished team of editors and board members who bring expertise and dedication to our journal
        </Typography>
      </Box>

      <SectionWrapper>
        <SectionTitle variant="h5">Editor-in-Chief</SectionTitle>
        <MemberPaper elevation={3} delay={200}>
          <EditorAvatar 
            src={getAvatarUrl("Rajeev Kansal")} 
            alt="Dr. Rajeev Kansal" 
            sx={{ width: 180, height: 180 }}
          />
          <Typography variant="h5" gutterBottom fontWeight={600} color="primary.dark" textAlign="center">
            Dr. Rajeev Kansal
          </Typography>
          <Typography variant="body1" textAlign="center" paragraph>
            Former Professor, Department of Civil Engineering
          </Typography>
          <Typography variant="body1" textAlign="center" paragraph>
            MITS-DU, Gwalior, India
          </Typography>
          <Box sx={{ 
            backgroundColor: 'primary.light', 
            color: 'primary.contrastText', 
            borderRadius: '30px',
            px: 3, 
            py: 1, 
            display: 'inline-block' 
          }}>
            <Typography variant="body2" fontWeight={500}>
              Construction Technology
            </Typography>
          </Box>
        </MemberPaper>
      </SectionWrapper>

      <SectionWrapper>
        <SectionTitle variant="h5">Associate Editors</SectionTitle>
        <Grid container spacing={4}>
          {/* <Grid item xs={12} md={6}>
            <MemberPaper elevation={3} delay={400}>
              <EditorAvatar 
                src={getAvatarUrl("M K Trivedi")} 
                alt="Dr. M. K Trivedi" 
              />
              <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark" textAlign="center">
                Dr. M. K Trivedi
              </Typography>
              <Typography variant="body1" textAlign="center" paragraph>
                Professor, Department of Civil Engineering
              </Typography>
              <Typography variant="body1" textAlign="center" paragraph>
                MITS-DU, Gwalior, India
              </Typography>
              <Box sx={{ 
                backgroundColor: 'primary.light', 
                color: 'primary.contrastText', 
                borderRadius: '30px',
                px: 3, 
                py: 1, 
                display: 'inline-block' 
              }}>
                <Typography variant="body2" fontWeight={500}>
                  Water Resource Engineering
                </Typography>
              </Box>
            </MemberPaper>
          </Grid> */}
          
          <Grid item xs={12} md={6}>
            <MemberPaper elevation={3} delay={500}>
              <EditorAvatar 
                src={getAvatarUrl("Kamal Sharma")} 
                alt="Dr. Kamal Sharma" 
              />
              <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark" textAlign="center">
                Dr. Kamal Sharma
              </Typography>
              <Typography variant="body1" textAlign="center" paragraph>
                Director & CEO
              </Typography>
              <Typography variant="body1" textAlign="center" paragraph>
                Lord-Tech Datus Solutions Pvt. Ltd.
              </Typography>
            </MemberPaper>
          </Grid>
        </Grid>
      </SectionWrapper>

      <SectionWrapper>
        <SectionTitle variant="h5">Editorial Board Members</SectionTitle>
        <Grid container spacing={4}>
          {/* <Grid item xs={12} md={4}>
            <MemberPaper elevation={3} delay={700}>
              <EditorAvatar 
                src={getAvatarUrl("Prachi Singh")} 
                alt="Dr. Prachi Singh" 
              />
              <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark" textAlign="center">
                Dr. Prachi Singh
              </Typography>
              <Box sx={{ 
                backgroundColor: 'primary.light', 
                color: 'primary.contrastText', 
                borderRadius: '30px',
                px: 3, 
                py: 1, 
                mb: 2, 
                display: 'inline-block' 
              }}>
                <Typography variant="body2" fontWeight={500}>
                  Environmental Engineering
                </Typography>
              </Box>
              <Typography variant="body1" textAlign="center">
                MITS-DU, India
              </Typography>
            </MemberPaper>
          </Grid> */}
          {/* <Grid item xs={12} md={4}>
            <MemberPaper elevation={3} delay={800}>
              <EditorAvatar 
                src={getAvatarUrl("Abhilash Shukla")} 
                alt="Dr. Abhilash Shukla" 
              />
              <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark" textAlign="center">
                Dr. Abhilash Shukla
              </Typography>
              <Box sx={{ 
                backgroundColor: 'primary.light', 
                color: 'primary.contrastText', 
                borderRadius: '30px',
                px: 3, 
                py: 1, 
                mb: 2, 
                display: 'inline-block' 
              }}>
                <Typography variant="body2" fontWeight={500}>
                  Concrete Technology
                </Typography>
              </Box>
              <Typography variant="body1" textAlign="center">
                MITS-DU, India
              </Typography>
            </MemberPaper>
          </Grid> */}
          <Grid item xs={12} md={4}>
            <MemberPaper elevation={3} delay={900}>
              <EditorAvatar 
                src={getAvatarUrl("Editorial Member")} 
                alt="Editorial Board" 
              />
              <Typography variant="body1" textAlign="center" color="text.secondary">
                Interested in joining our editorial board?
              </Typography>
              <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                Contact us to learn more about opportunities
              </Typography>
            </MemberPaper>
          </Grid>
        </Grid>
      </SectionWrapper>
    </Container>
  );
};

export default EditorialTeam; 