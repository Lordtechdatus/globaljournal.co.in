import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia,
  Divider,
  Fade,
  Grow,
  Slide
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  School, 
  Engineering, 
  Construction, 
  Park, 
  Visibility, 
  SupervisorAccount 
} from '@mui/icons-material';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  '&:after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: -8,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10],
  }
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 60,
    color: theme.palette.primary.main,
  }
}));

const AboutTheJournal = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section with Hero Image */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ position: 'relative', mb: 8, borderRadius: 2, overflow: 'hidden', boxShadow: 6 }}>
          <img 
            src="/GJCME Logo.webp" 
            alt="Construction Management Journal" 
            style={{ 
              width: '100%', 
              height: '300px',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.7)'
            }} 
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              p: 4
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                mb: 2
              }}
            >
              About The Journal
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                maxWidth: 800,
                textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
              }}
            >
              The Global Journal of Construction Management and Engineering (GJCME)
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* Introduction Section */}
      <Grid container spacing={5} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Slide direction="right" in={true} timeout={800} mountOnEnter>
            <Box>
              <SectionTitle variant="h4">Welcome to GJCME</SectionTitle>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Welcome to The Global Journal of Construction Management and Engineering (GJCME) – a prestigious 
                international platform dedicated to advancing research and practice in the fields of construction 
                management, engineering, and sustainable infrastructure development.
              </Typography>
              <Typography variant="body1" paragraph>
                Under the editorial leadership of Dr. Rajeev Kansal, the journal is committed to promoting 
                innovation, excellence, and impact across the global construction and civil engineering community.
              </Typography>
            </Box>
          </Slide>
        </Grid>
        <Grid item xs={12} md={6}>
          <Slide direction="left" in={true} timeout={800} mountOnEnter>
          <Paper
  elevation={3}
  sx={{
    borderRadius: 2,
    overflow: 'hidden',
    width: { xs: '100%', md: '50%' }, // 100% on mobile, 50% on desktop
    mx: 'auto', // center horizontally
  }}
>
  <img
    src="/aboutjournal.png"
    alt="Journal Cover"
    style={{
      width: '90%',
      marginLeft: '5%',
      marginTop: '5%',
      marginBottom: '5%',
      height: 'auto', // preserve natural aspect ratio
      objectFit: 'cover',
    }}
  />
</Paper>

          </Slide>
        </Grid>
      </Grid>

      {/* Scope and Focus Section */}
      <Box sx={{ mb: 8 }}>
        <Fade in={true} timeout={1000}>
          <Box>
            <SectionTitle variant="h4">📚 Scope and Focus</SectionTitle>
            <Typography variant="body1" paragraph>
              GJCME publishes peer-reviewed articles that span a wide spectrum of topics in construction and engineering.
            </Typography>
          </Box>
        </Fade>
        
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {[
            { 
              title: 'Project Planning', 
              icon: <Construction />, 
              description: 'Construction project planning and control methodologies'
            },
            { 
              title: 'Optimization', 
              icon: <Engineering />, 
              description: 'Time–cost–quality optimization techniques and applications'
            },
            { 
              title: 'Smart Technologies', 
              icon: <Park />, 
              description: 'Building Information Modeling (BIM) and smart construction technologies'
            },
            { 
              title: 'Risk Management', 
              icon: <School />, 
              description: 'Risk management and sustainable design practices'
            },
            { 
              title: 'Data-Driven Decisions', 
              icon: <Visibility />, 
              description: 'Data-driven decision-making in construction'
            },
            { 
              title: 'AI & Machine Learning', 
              icon: <SupervisorAccount />, 
              description: 'AI, machine learning, and data analytics in construction'
            }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Grow in={true} timeout={1000 + (index * 300)} style={{ transformOrigin: '0 0 0' }}>
                <FeatureCard elevation={3}>
                  <CardContent>
                    <IconBox>
                      {item.icon}
                    </IconBox>
                    <Typography variant="h6" component="h3" align="center" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission & Vision Section */}
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Slide direction="right" in={true} timeout={800} mountOnEnter>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f1f9 100%)',
                }}
              >
                <SectionTitle variant="h5">🎯 Our Mission</SectionTitle>
                <Typography variant="body1">
                  To disseminate high-quality, original research that drives advancements in construction 
                  management and engineering, while supporting global sustainability goals and modern 
                  infrastructure demands.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
          <Grid item xs={12} md={6}>
            <Slide direction="left" in={true} timeout={800} mountOnEnter>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #e9f1f9 0%, #d7e5f2 100%)',
                }}
              >
                <SectionTitle variant="h5">🌍 Our Vision</SectionTitle>
                <Typography variant="body1">
                  To establish GJCME as a leading voice in construction and engineering research worldwide, 
                  known for rigorous peer review, academic integrity, and real-world applicability.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Box>

      {/* Why Publish Section */}
      <Box sx={{ mb: 8 }}>
        <Fade in={true} timeout={1000}>
          <Box>
            <SectionTitle variant="h4">💡 Why Publish with GJCME?</SectionTitle>
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box sx={{ mr: 2, mt: 0.5 }}>
                    <School color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>Expert Editorial Board</Typography>
                    <Typography variant="body2">
                      Led by Dr. Rajeev Kansal, with reviewers from top institutions and industries.
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box sx={{ mr: 2, mt: 0.5 }}>
                    <Engineering color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>Interdisciplinary Approach</Typography>
                    <Typography variant="body2">
                      Integrating engineering, management, and data sciences.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box sx={{ mr: 2, mt: 0.5 }}>
                    <Visibility color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>Rapid Review Process</Typography>
                    <Typography variant="body2">
                      Ensuring timely dissemination of research.
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box sx={{ mr: 2, mt: 0.5 }}>
                    <SupervisorAccount color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>Global Visibility</Typography>
                    <Typography variant="body2">
                      Through indexing, open access options, and strategic partnerships.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Box>

      {/* Collaborate Section */}
      <Fade in={true} timeout={1000}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          }}
        >
          <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
🤝 Let's Collaborate
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', maxWidth: 800, mx: 'auto' }}>
            Whether you're an academic researcher, industry professional, or policymaker, 
            The Global Journal of Construction Management and Engineering invites you to join us in 
            shaping the future of construction. Share your insights, showcase your innovations, and 
            contribute to building smarter, safer, and more sustainable infrastructure for generations to come.
          </Typography>
        </Paper>
      </Fade>
    </Container>
  );
};

export default AboutTheJournal;