import React, { useState } from 'react';
import {
  Container, Box, Paper, Typography, Button, Checkbox,
  FormControlLabel, FormGroup, FormHelperText, Divider,
  Alert, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import { isLoggedIn, useRequireAuth } from '../../utils/authUtils';
import TiptapEditor from './TiptapEditor';

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

const AuthCTA = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(5),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export default function TitleSubmission() {
  const [title, setTitle] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const navigate = useNavigate();
  
  const authenticated = isLoggedIn();

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!privacyConsent) {
      newErrors.privacyConsent = 'You must agree to the privacy statement';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmissionError(null);
    
    try {
      // const userToken = localStorage.getItem('userToken');
      // let submitted_by = null;
      
      // if (userToken) {
      //   try {
      //     const parsedToken = JSON.parse(userToken);
      //     submitted_by = parsedToken.id;
      //   } catch (error) {
      //     console.error("Failed to parse userToken:", error);
      //   }
      // }
      
      // const response = await axios.post('https://backend.globaljournal.co.in/title_submission.php', {
      //   title,
      //   submitted_by
      // });

      localStorage.setItem('title', title);
    
      //console.log('✅ Response from backend:', response.data);
      // Navigate to the submission detail page instead of showing an alert
      navigate('/submission-detail');
    } catch (error) {
     // console.error('❌ Submission error details:', error);
     // console.error('❌ Error response data:', error.response?.data);
      setSubmissionError('An error occurred while submitting. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  // Content for non-authenticated users
  const NonAuthenticatedContent = () => (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <StyledPaper>
        <SectionTitle>Submissions</SectionTitle>
        
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
          Login or Register to make a submission.
        </Typography>
        
        <Box my={4}>
          <Typography variant="h6" gutterBottom>Author Guidelines</Typography>
          <Typography paragraph>
            Authors are invited to make a submission to this journal. All submissions will be assessed by an editor 
            to determine whether they meet the aims and scope of this journal. Those considered to be a good fit will 
            be sent for peer review before determining whether they will be accepted or rejected.
          </Typography>
          
          <Typography paragraph>
            Before making a submission, authors are responsible for obtaining permission to publish any material 
            included with the submission, such as photos, documents and datasets. All authors identified on the 
            submission must consent to be identified as an author. Where appropriate, research should be approved 
            by an appropriate ethics committee in accordance with the legal requirements of the study's country.
          </Typography>
          
          <Typography paragraph>
            An editor may desk reject a submission if it does not meet minimum standards of quality. Before submitting, 
            please ensure that the study design and research argument are structured and articulated properly. The title 
            should be concise and the abstract should be able to stand on its own. This will increase the likelihood of 
            reviewers agreeing to review the paper. When you're satisfied that your submission meets this standard, 
            please follow the checklist below to prepare your submission.
          </Typography>
        </Box>
        
        <AuthCTA>
          <Typography variant="h6" gutterBottom>
            Ready to submit your manuscript?
          </Typography>
          <Box mt={2}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/login"
              size="large"
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to="/signup"
              size="large"
            >
              Register
            </Button>
          </Box>
        </AuthCTA>
      </StyledPaper>
    </Container>
  );

  // Render different content based on authentication status
  if (!authenticated) {
    return <NonAuthenticatedContent />;
  }

  // Original submission form for authenticated users
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <StyledPaper>
        <SectionTitle>Global Journal of Construction Management and Engineering (GJCME) </SectionTitle>
        <Typography variant="h5" gutterBottom>Make a Submission</Typography>
        
        <Box mt={4} mb={3}>
          <Typography variant="h6" gutterBottom>Before you begin</Typography>
          <Typography paragraph>
            Thank you for submitting to the Global Journal of Construction Management and Engineering (GJCME). You will be asked to upload files, identify co-authors, and provide information such as the title and abstract.
          </Typography>
          <Typography paragraph>
            Please read our Submission Guidelines if you have not done so already. When filling out the forms, provide as many details as possible in order to help our editors evaluate your work.
          </Typography>
          <Typography paragraph>
            Once you begin, you can save your submission and come back to it later. You will be able to review and correct any information before you submit.
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {submissionError && (
          <Alert severity="error" sx={{ mb: 3 }}>{submissionError}</Alert>
        )}
        
        <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
  <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
    Title <Box component="span" sx={{ color: 'error.main' }}>*</Box>
  </Typography>
  <TiptapEditor content={title || ''} onChange={setTitle} />
  {errors.title && (
    <FormHelperText error>{errors.title}</FormHelperText>
  )}
</Box>


          
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>Privacy Statement *</Typography>
            <Typography paragraph>
              The names and email addresses entered in this journal site will be used exclusively for the stated purposes of this journal and will not be made available for any other purpose or to any other party.
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  name="privacyConsent"
                />
              }
              label="I agree to the privacy statement."
            />
            
            {errors.privacyConsent && (
              <FormHelperText error>{errors.privacyConsent}</FormHelperText>
            )}
          </Box>
          
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>Submission Checklist *</Typography>
            <Typography paragraph>
              All submissions must meet the following requirements.
            </Typography>
            
            <Box sx={{ pl: 2 }}>
              <Typography component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>•</Box>
                <Box component="span">This submission meets the requirements outlined in the Author Guidelines.</Box>
              </Typography>
              
              <Typography component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>•</Box>
                <Box component="span">This submission has not been previously published, nor is it before another journal for consideration.</Box>
              </Typography>
              
              <Typography component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>•</Box>
                <Box component="span">All references have been checked for accuracy and completeness.</Box>
              </Typography>
              
              <Typography component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>•</Box>
                <Box component="span">All tables and figures have been numbered and labeled.</Box>
              </Typography>
              
              <Typography component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>•</Box>
                <Box component="span">Permission has been obtained to publish all photos, datasets and other material provided with this submission.</Box>
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Continue"}
            </Button>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
} 