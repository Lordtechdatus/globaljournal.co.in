import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import './styles.css';

// Styled component for the page container
const PageContainer = styled(Box)(({ theme }) => ({
  animation: 'fadeIn 0.8s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
  }
}));

const Announcements = () => {
  return (
    <PageContainer>
      <Container maxWidth="lg" sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h2" sx={{ fontWeight: 600, color: '#3f51b5', textAlign: 'center' }}>
          🚧 Coming Soon!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          This page will host important announcements and updates.
        </Typography>
      </Container>
    </PageContainer>
  );
};

export default Announcements; 