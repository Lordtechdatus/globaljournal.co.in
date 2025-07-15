import React, { useState, useEffect } from 'react';
import {
  Container, Box, Paper, Typography, TextField, Button, 
  Stepper, Step, StepLabel, IconButton, Divider,
  Grid, useTheme, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRequireAuth } from '../../utils/authUtils';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TiptapEditor from './TiptapEditor';
import { FormHelperText } from '@mui/material';
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const FormattingButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5),
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function SubmissionDetail() {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [abstract, setAbstract] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const navigate = useNavigate();
  const { submissionId } = useParams();
  
  // Use our custom auth hook to require authentication
  const isAuthenticated = useRequireAuth(true, true);

  // useEffect(() => {
  //   // If we have a submissionId, fetch the submission details
  //   if (submissionId) {
  //     setLoading(true);
  //     // For now, we're using mock data. In a real app, you would fetch from API
  //     // Example: ApiService.getSubmissionById(submissionId)
  //     setTimeout(() => {
  //       // Mock response - replace with actual API call
  //       const mockSubmission = {
  //         id: parseInt(submissionId),
  //         title: 'Pushkar',
  //         subtitle: 'tester submission',
  //         abstract: 'This is a sample abstract for the submission. It would contain details about the research paper.',
  //         keywords: 'test, submission, example',
  //         status: 'Incomplete',
  //         lastActivity: 'Saturday, April 12, 2025'
  //       };
        
  //       setSubmission(mockSubmission);
  //       setTitle(mockSubmission.title);
  //       setKeywords(mockSubmission.keywords);
  //       setAbstract(mockSubmission.abstract);
  //       setLoading(false);
  //     }, 1000);
  //   }
  // }, [submissionId]);

  useEffect(() => {
    const val = localStorage.getItem('title');
    setTitle(val);
  }, [])

  // If authentication is still being checked, show loading
  if (isAuthenticated === false) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  // If we're loading submission data, show loading
  if (submissionId && loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  const steps = [
    'Details', 'Upload Files', 'Contributors', 'For the Editors', 'Review'
  ];

  const saveLater = () => {
    // Save the submission data for later
    alert('Your submission has been saved for later.');
  };
  
  const handleContinue = () => {
    // Validate title field
    const newErrors = {};
    if (!title || title.replace(/<(.|\n)*?>/g, '').trim() === '') {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    // Save form data to localStorage before navigating
    try {
      const detailsData = {
        title,
        keywords: keywords.split(',').map(keyword => keyword.trim()),
        abstract
      };
      localStorage.setItem('submissionDetails', JSON.stringify(detailsData));
      // If we don't have a current submission ID, generate one
      if (!localStorage.getItem('currentSubmissionId')) {
        const submissionId = Date.now().toString();
        localStorage.setItem('currentSubmissionId', submissionId);
      }
      // Navigate to upload page
      navigate('/submission-upload');
    } catch (error) {
    //  console.error('Error saving submission details:', error);
      alert('An error occurred while saving your submission details. Please try again.');
    }
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
        {submissionId ? (
          <Typography variant="h4" component="h1">
            Submission: <span dangerouslySetInnerHTML={{ __html: title }} />
          </Typography>
        ) : (
          <Typography variant="h4" component="h1">
            Make a Submission: Details
          </Typography>
        )}
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
            Submission Details
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide the following details to help us manage your submission in our system.
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
              Title <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TiptapEditor content={title} onChange={setTitle} />
            {errors.title && (
              <FormHelperText error>{errors.title}</FormHelperText>
            )}
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
              Keywords
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Keywords are typically one- to three-word phrases that are used to indicate the main topics of a submission.
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter keywords separated by commas"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              sx={{ mb: 1 }}
              disabled={!!submissionId}
            />
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
              Abstract <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            {/* TODO: Replace with <TiptapEditor content={abstract} onChange={setAbstract} /> */}
            {/* <TiptapEditor content={abstract} onChange={setAbstract} /> */}
            {/* For now, use a simple textarea as a placeholder */}
            <textarea
              style={{ width: '100%', minHeight: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={abstract}
              onChange={e => setAbstract(e.target.value)}
              disabled={!!submissionId}
              placeholder="Enter the abstract of your submission"
            />
          </Box>
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!submissionId ? (
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
                Save and Continue
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/submission-upload`}
                sx={{ 
                  px: 4,
                  py: 1,
                  borderRadius: '40px',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Next: Upload Files
              </Button>
            )}
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
} 