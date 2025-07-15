import React, { useState, useEffect } from 'react';
import {
  Container, Box, Paper, Typography, Button, 
  Stepper, Step, StepLabel, Divider, useTheme,
  List, ListItem, ListItemText, CircularProgress,
  Card, CardContent, CardHeader, Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../../utils/authUtils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import ApiService from '../../Services/FetchNodeAdminServices';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

export default function SubmissionReview() {
  const [activeStep, setActiveStep] = useState(4); // Fifth and final step in the stepper
  const [loading, setLoading] = useState(true);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [validationStatus, setValidationStatus] = useState({
    details: false,
    files: false,
    contributors: false,
    editorComments: false
  });
  const [isAllValid, setIsAllValid] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Use our custom auth hook to require authentication
  const isAuthenticated = useRequireAuth(true, true);

  useEffect(() => {
    // Function to fetch all submission data
    const fetchSubmissionData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch from API using a submission ID
        // For now, let's get the data from localStorage if it exists
        const submissionId = localStorage.getItem('currentSubmissionId');
        let detailsData, filesData, contributorsData, editorData;
        
        // Get details from localStorage
        const storedDetails = localStorage.getItem('submissionDetails');
        detailsData = storedDetails ? JSON.parse(storedDetails) : {};
        
        // Get files from localStorage
        const storedFiles = localStorage.getItem('submissionFiles');
        filesData = storedFiles ? JSON.parse(storedFiles) : [];
        
        // Get contributors from localStorage
        const storedContributors = localStorage.getItem('submissionContributors');
        contributorsData = storedContributors ? JSON.parse(storedContributors) : [];
        
        // Get editor comments from localStorage
        const storedEditorComments = localStorage.getItem('submissionEditorComments');
        editorData = storedEditorComments || "";
        const userToken = localStorage.getItem('userToken');
        let submitted_by = null;
        
        if (userToken) {
          try {
            const parsedToken = JSON.parse(userToken);
            submitted_by = parsedToken.id;
          } catch (error) {
            // removed console.error
          }
        }
        // Combine all data
        const combinedData = {
          ...detailsData,
          files: filesData,
          contributors: contributorsData,
          editorComments: editorData,
          submitted_by: submitted_by
        };
        
        setSubmissionDetails(combinedData);
        
        // Validate all sections
        validateSubmission(combinedData);
        
        setLoading(false);
      } catch (error) {
        // removed console.error
        setLoading(false);
      }
    };
    
    fetchSubmissionData();
  }, []);

  // Function to validate all submission sections
  const validateSubmission = (data) => {
    const validation = {
      details: Boolean(data.title && data.abstract && data.keywords && data.keywords.length > 0),
      files: Boolean(data.files && data.files.length > 0),
      contributors: Boolean(data.contributors && data.contributors.length > 0),
      editorComments: Boolean(data.editorComments && data.editorComments.trim() !== '')
    };
    
    setValidationStatus(validation);
    
    // Check if all sections are valid
    const allValid = Object.values(validation).every(value => value === true);
    setIsAllValid(allValid);
  };

  // If authentication is still being checked, show loading
  if (isAuthenticated === false) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }
  
  // If data is still loading, show loading spinner
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  const steps = [
    'Details', 'Upload Files', 'Contributors', 'For the Editors', 'Review'
  ];

  const saveLater = () => {
    // Save the submission data for later
    alert('Your submission has been saved for later.');
  };

  const handleBack = () => {
    navigate('/submission-editors');
  };

  const handleSubmit = async (retryCount = 0) => {
    try {
      if (!isAllValid) {
        alert('Please complete all required sections before submitting.');
        return;
      }
  
      setLoading(true);
  
      // Send data to backend
      const response = await ApiService.post('make_submission.php', submissionDetails);
  
      // If the submission is unsuccessful, attempt to retry up to 2 times
      if (!response.success && retryCount < 2) {
        return handleSubmit(retryCount + 1); // Retry the submission
      }
  
      // If submission is successful, clear localStorage and navigate
      if (response.success) {
        localStorage.removeItem('submissionDetails');
        localStorage.removeItem('submissionFiles');
        localStorage.removeItem('submissionContributors');
        localStorage.removeItem('submissionEditorComments');
        localStorage.removeItem('currentSubmissionId');
  
        alert('Your submission has been successfully submitted!');
        navigate('/submissions');
      } else {
        alert(' failed after multiple attempts. Please try again later.');
      }
  
    } catch (error) {
      // removed console.error
  
      // Handle errors and retry if it's a network-related error
      if (retryCount < 2 && error.code === 'ERR_NETWORK') {
        return handleSubmit(retryCount + 1); // Retry the submission on network error
      }
  
      // Provide error message to the user
      let errorMessage = 'An error occurred while submitting. Please try again.';
  
      if (error.response) {
        // If the error contains a response (HTTP error), get the message from the response
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.code === 'ERR_NETWORK') {
        // Network-related error
        errorMessage = 'Network error. Please check your connection and try again.';
      }
  
      alert(errorMessage);
    } finally {
      // Always set loading to false, even if the submission failed
      setLoading(false);
    }
  };
  
  // Render validation status icon for each section
  const renderValidationIcon = (isValid) => {
    if (isValid) {
      return <CheckCircleIcon color="success" sx={{ ml: 1 }} />;
    } else {
      return <ErrorIcon color="error" sx={{ ml: 1 }} />;
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
        <Typography variant="h4" component="h1">Make a Submission: Review</Typography>
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
            Review Your Submission
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please review all details of your submission before finalizing. You can go back to previous steps to make changes if needed.
          </Typography>
          
          {/* Submission Details Section */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">Submission Details</Typography>
                  {renderValidationIcon(validationStatus.details)}
                </Box>
              }
              action={
                <Button
                  startIcon={<EditIcon />}
                  sx={{ textTransform: 'none' }}
                  onClick={() => navigate('/submission-detail')}
                >
                  Edit
                </Button>
              }
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            />
            <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
            <span dangerouslySetInnerHTML={{ __html: submissionDetails?.title }} />
            </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Abstract:</strong> {submissionDetails?.abstract}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {submissionDetails?.keywords?.map((keyword, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      bgcolor: 'rgba(0,0,0,0.08)', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 4,
                      fontSize: '0.875rem'
                    }}
                  >
                    {keyword}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
          
          {/* Files Section */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">Files</Typography>
                  {renderValidationIcon(validationStatus.files)}
                </Box>
              }
              action={
                <Button
                  startIcon={<EditIcon />}
                  sx={{ textTransform: 'none' }}
                  onClick={() => navigate('/submission-upload')}
                >
                  Edit
                </Button>
              }
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            />
            <CardContent>
              <List sx={{ p: 0 }}>
                {submissionDetails?.files?.map((file, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      px: 2, 
                      py: 1, 
                      borderBottom: index < submissionDetails.files.length - 1 ? '1px solid' : 'none', 
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } 
                    }}
                    secondaryAction={
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        Download
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={file.name}
                      secondary={`${file.type} · ${file.size}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          
          {/* Contributors Section */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">Contributors</Typography>
                  {renderValidationIcon(validationStatus.contributors)}
                </Box>
              }
              action={
                <Button
                  startIcon={<EditIcon />}
                  sx={{ textTransform: 'none' }}
                  onClick={() => navigate('/submission-contributors')}
                >
                  Edit
                </Button>
              }
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            />
            <CardContent>
              <List sx={{ p: 0 }}>
                {submissionDetails?.contributors?.map((contributor, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      px: 2, 
                      py: 1.5, 
                      borderBottom: index < submissionDetails.contributors.length - 1 ? '1px solid' : 'none', 
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } 
                    }}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                      {contributor.name.charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={contributor.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {contributor.affiliation}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                            {contributor.role}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          
          {/* Editor Comments Section */}
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">Comments for the Editor</Typography>
                  {renderValidationIcon(validationStatus.editorComments)}
                </Box>
              }
              action={
                <Button
                  startIcon={<EditIcon />}
                  sx={{ textTransform: 'none' }}
                  onClick={() => navigate('/submission-editors')}
                >
                  Edit
                </Button>
              }
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
              <span dangerouslySetInnerHTML={{ __html: submissionDetails?.editorComments }} />
              </Typography>
            </CardContent>
          </Card>
          
          <Box sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: theme.shape.borderRadius, 
            bgcolor: isAllValid ? 'rgba(76, 175, 80, 0.08)' : 'rgba(211, 47, 47, 0.08)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {isAllValid ? (
              <>
                <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                <Typography>
                  All required information has been provided. Your submission is ready to be submitted.
                </Typography>
              </>
            ) : (
              <>
                <ErrorIcon color="error" sx={{ mr: 2 }} />
                <Typography>
                  Please complete all required sections before submitting.
                </Typography>
              </>
            )}
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
                Last saved 5 minutes ago
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
                onClick={handleSubmit}
                disabled={loading || !isAllValid}
                sx={{ 
                  px: 4,
                  py: 1,
                  borderRadius: '40px',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
} 