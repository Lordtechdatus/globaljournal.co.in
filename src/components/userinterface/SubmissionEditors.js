import React, { useState } from 'react';
import {
  Container, Box, Paper, Typography, Button, 
  Stepper, Step, StepLabel, Divider, useTheme,
  TextField, CircularProgress, Card, CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../../utils/authUtils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import TiptapEditor from './TiptapEditor';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

const TextEditor = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const TextEditorToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const TextEditorContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: '150px',
}));

export default function SubmissionEditors() {
  const [activeStep, setActiveStep] = useState(3); // Fourth step in the stepper
  const theme = useTheme();
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState('');
  
  // Use our custom auth hook to require authentication
  const isAuthenticated = useRequireAuth(true, true);

  // If authentication is still being checked, show loading
  if (isAuthenticated === false) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  const steps = [
    'Details', 'Upload Files', 'Contributors', 'For the Editors', 'Review'
  ];

  const saveLater = () => {
    // Save the submission data for later
    localStorage.setItem('submissionEditorComments', editorContent);
    alert('Your submission has been saved for later.');
  };

  const handleBack = () => {
    navigate('/submission-contributors');
  };

  const handleContinue = () => {
    // Save editor content to localStorage before navigating
    localStorage.setItem('submissionEditorComments', editorContent);
    // Navigate to the review page
    navigate('/submission-review');
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button 
          component={Link} 
          to="/submissions" 
          startIcon={<ArrowBackIcon />}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 'normal',
            color: theme.palette.text.secondary
          }}
        >
          Back to Submissions
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Make a Submission: For the Editors</Typography>
        <Button 
          variant="outlined" 
          onClick={saveLater}
          sx={{ 
            borderRadius: '20px',
            textTransform: 'none',
          }}
        >
          Save for Later
        </Button>
      </Box>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <StyledPaper>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            For the Editors
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide the following details in order to help our editorial team manage your submission.
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Comments for the Editor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add any information that you think our editorial staff should know when evaluating your submission.
            </Typography>
            

              {/* Remove custom toolbar, use TiptapEditor toolbar */}
              <TextEditorContent>
                <TiptapEditor content={editorContent} onChange={setEditorContent} />
              </TextEditorContent>
          
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              When entering metadata, provide entries that you think would be most helpful to the person
              managing your submission. This information can be changed before publication.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{ 
                px: 4,
                py: 1,
                borderRadius: '40px',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Back
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                Last saved 31 minutes ago
              </Typography>
              
              <Button
                variant="outlined"
                onClick={saveLater}
                sx={{ 
                  px: 4,
                  py: 1,
                  borderRadius: '40px',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Save for Later
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinue}
                sx={{ 
                  px: 4,
                  py: 1,
                  borderRadius: '40px',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
} 