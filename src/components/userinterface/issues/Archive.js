import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const Archive = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 500, color: '#3f51b5', textAlign: 'center' }}>
          Page Under Construction
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 2 }}>
          We're working hard to bring this section to life. Please check back soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default Archive; 