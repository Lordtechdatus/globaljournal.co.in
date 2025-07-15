import React, { useState, useEffect } from 'react';
import {
  Container, Box, Paper, Typography, Button, 
  Stepper, Step, StepLabel, Divider, useTheme,
  List, ListItem, ListItemText, Grid, Card,
  CardContent, TextField, ButtonGroup, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, 
  Checkbox, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRequireAuth } from '../../utils/authUtils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ApiService from '../../Services/FetchNodeAdminServices';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

export default function SubmissionContributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(2); // Third step in the stepper
  const theme = useTheme();
  const navigate = useNavigate();
  const { submissionId } = useParams();
  
  // State for the edit dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [editFormData, setEditFormData] = useState({
    givenName: '',
    familyName: '',
    preferredName: '',
    email: '',
    country: '',
    homepageURL: '',
    orcidID: '',
    bioStatement: '',
    affiliation: '',
    isAuthor: true,
    isTranslator: false,
    includeInPublications: true,
    isPrimaryContact: false
  });
  
  // Use our custom auth hook to require authentication
  const isAuthenticated = useRequireAuth(true, true);

  // Fetch contributors when component mounts
  useEffect(() => {
    const fetchContributors = async () => {
      if (!submissionId) return;
      
      setLoading(true);
      try {
        const response = await ApiService.getSubmissionContributors(submissionId);
        if (response.data && response.data.contributors) {
          setContributors(response.data.contributors);
        } else {
          // Set to empty array if no contributors found
          setContributors([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching contributors:', err);
        setError('Failed to load contributors. Please try again later.');
        // Don't reset contributors on error to keep any draft data
      } finally {
        setLoading(false);
      }
    };

    const populateCurrentUser = async () => {
      try {
        // Only fetch user profile if we don't have contributors yet
        const savedContributors = localStorage.getItem('submissionContributors');
        if (!savedContributors || JSON.parse(savedContributors).length === 0) {
          setLoading(true);
          console.log('Fetching user profile for contributor data...');
          const response = await ApiService.getUserProfile();
          
          console.log('User profile data received:', response.data);
          
          if (response.data && response.data.user) {
            const user = response.data.user;
            console.log('User profile details:', {
              name: `${user.firstName || ''} ${user.lastName || ''}`,
              email: user.email,
              country: user.country,
              affiliation: user.affiliation
            });
            
            // Extract first and last name
            let firstName = user.firstName || '';
            let lastName = user.lastName || '';
            
            // If we only have a single name field in the profile
            if (!firstName && !lastName && user.name) {
              const nameParts = user.name.split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            }
            
            // Create a contributor from the current user
            const userContributor = {
              name: `${firstName} ${lastName}`.trim(),
              givenName: firstName,
              familyName: lastName,
              preferredName: user.preferredName || `${firstName} ${lastName}`.trim(),
              email: user.email || '',
              country: user.country || 'India', // Default to India as shown in the example
              homepageURL: user.website || '',
              orcidID: user.orcidID || '',
              bioStatement: user.bio || '',
              affiliation: user.affiliation || '',
              isAuthor: true,
              isTranslator: false,
              includeInPublications: true,
              isPrimaryContact: true
            };
            
            console.log('Created contributor from user profile:', userContributor);
            
            // Only set this if we have at least some identifying information
            if (userContributor.name || userContributor.email) {
              setContributors([userContributor]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Don't set error - just continue without auto-populated user
      } finally {
        setLoading(false);
      }
    };

    if (submissionId) {
      fetchContributors();
    } else {
      // Check localStorage for draft data if no submissionId
      const savedContributors = localStorage.getItem('submissionContributors');
      if (savedContributors) {
        try {
          const parsed = JSON.parse(savedContributors);
          console.log('Retrieved saved contributors from localStorage:', parsed);
          
          // Transform format if needed
          const formattedContributors = parsed.map(contributor => {
            // Handle name fields
            let givenName = contributor.givenName || '';
            let familyName = contributor.familyName || '';
            
            // If we don't have split names but have a full name, try to split it
            if (!givenName && !familyName && contributor.name) {
              const nameParts = contributor.name.split(' ');
              if (nameParts.length > 1) {
                givenName = nameParts[0];
                familyName = nameParts.slice(1).join(' ');
              } else {
                givenName = contributor.name;
              }
            }
            
            return {
              name: contributor.name || `${givenName} ${familyName}`.trim(),
              givenName,
              familyName,
              preferredName: contributor.preferredName || '',
              email: contributor.email || '',
              country: contributor.country || 'India',
              homepageURL: contributor.homepageURL || '',
              orcidID: contributor.orcidID || '',
              bioStatement: contributor.bioStatement || '',
              affiliation: contributor.affiliation || '',
              isAuthor: contributor.role?.includes('Author') || false,
              isTranslator: contributor.role?.includes('Translator') || false,
              includeInPublications: contributor.includeInPublications !== undefined ? contributor.includeInPublications : true,
              isPrimaryContact: contributor.role?.includes('Primary Contact') || false
            };
          });
          
          console.log('Formatted contributors for display:', formattedContributors);
          setContributors(formattedContributors);
        } catch (err) {
          console.error('Error parsing saved contributors:', err);
        }
      } else {
        // No contributors in localStorage, try to populate with current user
        populateCurrentUser();
      }
    }
  }, [submissionId]);

  // If authentication is still being checked, show loading
  if (isAuthenticated === false) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  const steps = [
    'Details', 'Upload Files', 'Contributors', 'For the Editors', 'Review'
  ];

  const saveLater = async () => {
    // Save the submission data for later
    try {
      setLoading(true);
      
      // Transform the contributors data
      const contributorsData = contributors.map(contributor => ({
        name: contributor.name,
        givenName: contributor.givenName,
        familyName: contributor.familyName,
        preferredName: contributor.preferredName,
        email: contributor.email,
        country: contributor.country,
        homepageURL: contributor.homepageURL,
        orcidID: contributor.orcidID,
        bioStatement: contributor.bioStatement,
        affiliation: contributor.affiliation,
        role: contributor.isPrimaryContact ? 
          `${contributor.isAuthor ? 'Author' : 'Contributor'}${contributor.isTranslator ? ', Translator' : ''}, Primary Contact` : 
          `${contributor.isAuthor ? 'Author' : 'Contributor'}${contributor.isTranslator ? ', Translator' : ''}`,
        includeInPublications: contributor.includeInPublications
      }));
      
      console.log('Saving contributors data:', contributorsData);
      
      // Save to localStorage
      localStorage.setItem('submissionContributors', JSON.stringify(contributorsData));
      
      // Save to API if submissionId exists
      if (submissionId) {
        await ApiService.saveSubmissionContributors(submissionId, contributorsData);
      }
      
      setError(null);
      alert('Your submission has been saved for later.');
    } catch (err) {
      console.error('Error saving contributors:', err);
      setError('Failed to save contributors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/submission-upload');
  };

  const handleContinue = async () => {
    // Save contributors data before navigating
    try {
      setLoading(true);
      
      // Transform the contributors data to match the expected format in review
      const contributorsData = contributors.map(contributor => ({
        name: contributor.name,
        givenName: contributor.givenName,
        familyName: contributor.familyName,
        preferredName: contributor.preferredName,
        email: contributor.email,
        country: contributor.country,
        homepageURL: contributor.homepageURL,
        orcidID: contributor.orcidID,
        bioStatement: contributor.bioStatement,
        affiliation: contributor.affiliation,
        role: contributor.isPrimaryContact ? 
          `${contributor.isAuthor ? 'Author' : 'Contributor'}${contributor.isTranslator ? ', Translator' : ''}, Primary Contact` : 
          `${contributor.isAuthor ? 'Author' : 'Contributor'}${contributor.isTranslator ? ', Translator' : ''}`,
        includeInPublications: contributor.includeInPublications
      }));
      
      console.log('Saving contributors data before continuing:', contributorsData);
      
      // Save to localStorage
      localStorage.setItem('submissionContributors', JSON.stringify(contributorsData));
      
      // Save to API if submissionId exists
      if (submissionId) {
        await ApiService.saveSubmissionContributors(submissionId, contributorsData);
      }
      
      setError(null);
      
      // Navigate to the editors page
      navigate(submissionId ? `/submission-editors/${submissionId}` : '/submission-editors');
    } catch (err) {
      console.error('Error saving contributors data:', err);
      setError('An error occurred while saving your contributors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContributor = () => {
    // Add a new empty contributor to the list
    const newContributor = {
      name: '',
      affiliation: '',
      isAuthor: true,
      isPrimaryContact: contributors.length === 0 // Make primary contact if this is the first contributor
    };
    
    setContributors(prev => [...prev, newContributor]);
    
    // Set the index of the last contributor for editing
    const newIndex = contributors.length;
    handleEditContributor(newIndex);
  };

  // Handle opening the edit dialog
  const handleEditContributor = (index) => {
    const contributor = contributors[index];
    if (contributor) {
      console.log('Editing contributor:', contributor);
      
      // Use pre-split names if available, otherwise split name field
      let givenName = contributor.givenName || '';
      let familyName = contributor.familyName || '';
      
      if (!givenName && !familyName && contributor.name) {
        const nameParts = contributor.name.split(' ');
        if (nameParts.length > 1) {
          givenName = nameParts[0];
          familyName = nameParts.slice(1).join(' ');
        } else {
          givenName = contributor.name;
        }
      }
      
      setEditFormData({
        givenName,
        familyName,
        preferredName: contributor.preferredName || '',
        email: contributor.email || '',
        country: contributor.country || 'India', // Default to India as shown in example
        homepageURL: contributor.homepageURL || '',
        orcidID: contributor.orcidID || '',
        bioStatement: contributor.bioStatement || '',
        affiliation: contributor.affiliation || '',
        isAuthor: contributor.isAuthor !== undefined ? contributor.isAuthor : true,
        isTranslator: contributor.isTranslator || false,
        includeInPublications: contributor.includeInPublications !== undefined ? contributor.includeInPublications : true,
        isPrimaryContact: contributor.isPrimaryContact || false
      });
      
      setEditIndex(index);
      setOpenEditDialog(true);
    }
  };

  // Handle closing the edit dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditIndex(-1);
  };

  // Handle form field changes
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle saving the edit form
  const handleSaveContributor = () => {
    const updatedContributors = [...contributors];
    const fullName = `${editFormData.givenName} ${editFormData.familyName}`.trim();
    
    const updatedContributor = {
      name: fullName,
      givenName: editFormData.givenName,
      familyName: editFormData.familyName,
      preferredName: editFormData.preferredName,
      email: editFormData.email,
      country: editFormData.country,
      homepageURL: editFormData.homepageURL,
      orcidID: editFormData.orcidID,
      bioStatement: editFormData.bioStatement,
      affiliation: editFormData.affiliation,
      isAuthor: editFormData.isAuthor,
      isTranslator: editFormData.isTranslator,
      includeInPublications: editFormData.includeInPublications,
      isPrimaryContact: editFormData.isPrimaryContact
    };
    
    console.log('Saving updated contributor:', updatedContributor);
    
    // If this contributor is set as primary contact, update all others
    if (updatedContributor.isPrimaryContact) {
      updatedContributors.forEach((contributor, i) => {
        if (i !== editIndex) {
          contributor.isPrimaryContact = false;
        }
      });
    }
    
    // Update the contributor at the specified index
    updatedContributors[editIndex] = updatedContributor;
    setContributors(updatedContributors);
    
    // Close the dialog
    handleCloseEditDialog();
  };

  const handleDeleteContributor = (index) => {
    setContributors(prevContributors => 
      prevContributors.filter((_, i) => i !== index)
    );
  };

  const handleSetPrimaryContact = (index) => {
    setContributors(prevContributors => 
      prevContributors.map((contributor, i) => ({
        ...contributor,
        isPrimaryContact: i === index
      }))
    );
  };

  const handleOrderContributors = () => {
    // This would typically open a modal to order contributors
    alert('Order contributors');
  };

  const handlePreviewContributors = () => {
    // This would typically show a preview of how contributors will appear
    alert('Preview contributors');
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
        <Typography variant="h4" component="h1">Make a Submission: Contributors</Typography>
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
            Contributors
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add details for all of the contributors to this submission. Contributors added here will be sent 
            an email confirmation of the submission, as well as a copy of all editorial decisions recorded 
            against this submission.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            If a contributor can not be contacted by email, because they must remain anonymous or do not 
            have an email account, please do not enter a fake email address. You can add information 
            about this contributor in a message to the editor at a later step in the submission process.
          </Typography>
          
          {/* Display error message if there is one */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Show loading indicator while fetching data */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3">
                  Contributors
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {contributors.length > 0 && (
                    <>
                      <Button 
                        variant="outlined" 
                        onClick={handleOrderContributors}
                        sx={{ 
                          borderRadius: '20px',
                          textTransform: 'none',
                        }}
                      >
                        Order
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={handlePreviewContributors}
                        sx={{ 
                          borderRadius: '20px',
                          textTransform: 'none',
                        }}
                      >
                        Preview
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="contained" 
                    onClick={handleAddContributor}
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                    }}
                  >
                    Add Contributor
                  </Button>
                </Box>
              </Box>
              
              {/* Only render contributors list if there are contributors */}
              {contributors.length > 0 ? (
                contributors.map((contributor, index) => (
                  <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" component="h4">
                            {contributor.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ 
                              backgroundColor: 'rgba(0,0,0,0.08)', 
                              px: 1, 
                              py: 0.5, 
                              borderRadius: 1
                            }}>
                              {contributor.isAuthor ? 'Author' : 'Contributor'}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {contributor.affiliation}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {contributor.isPrimaryContact && (
                            <Button 
                              variant="contained" 
                              color="primary"
                              size="small"
                              sx={{ 
                                borderRadius: '20px',
                                textTransform: 'none',
                              }}
                            >
                              Primary Contact
                            </Button>
                          )}
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleEditContributor(index)}
                            sx={{ 
                              borderRadius: '20px',
                              textTransform: 'none',
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="error"
                            size="small"
                            onClick={() => handleDeleteContributor(index)}
                            sx={{ 
                              borderRadius: '20px',
                              textTransform: 'none',
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                      {!contributor.isPrimaryContact && (
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleSetPrimaryContact(index)}
                          sx={{ 
                            borderRadius: '20px',
                            textTransform: 'none',
                          }}
                        >
                          Set as Primary Contact
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, px: 2, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    No contributors found. Please add a contributor to continue.
                  </Typography>
                </Box>
              )}
            </>
          )}
          
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
                {loading ? 'Loading...' : 'Last saved 13 minutes ago'}
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
                disabled={loading || contributors.length === 0}
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
      
      {/* Contributor Edit Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editIndex === -1 ? 'Add Contributor' : 'Edit Contributor'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Given Name"
                name="givenName"
                value={editFormData.givenName}
                onChange={handleEditFormChange}
                margin="normal"
                helperText="Required"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Family Name"
                name="familyName"
                value={editFormData.familyName}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preferred Public Name"
                name="preferredName"
                value={editFormData.preferredName}
                onChange={handleEditFormChange}
                margin="normal"
                helperText="Please provide the full name as the author should be identified on the published work. Example: Dr. Alan P. Mwandenga"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email address"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
                margin="normal"
                helperText="Required"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="country-select-label">Country</InputLabel>
                <Select
                  labelId="country-select-label"
                  id="country-select"
                  name="country"
                  value={editFormData.country}
                  onChange={handleEditFormChange}
                  label="Country"
                  required
                >
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="United States">United States</MenuItem>
                  <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                  <MenuItem value="Australia">Australia</MenuItem>
                  {/* Add more countries as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Homepage URL"
                name="homepageURL"
                value={editFormData.homepageURL}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ORCID iD"
                name="orcidID"
                value={editFormData.orcidID}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio Statement"
                name="bioStatement"
                value={editFormData.bioStatement}
                onChange={handleEditFormChange}
                margin="normal"
                multiline
                rows={4}
                helperText="e.g., department and rank"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Affiliation"
                name="affiliation"
                value={editFormData.affiliation}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Contributor's role
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editFormData.isAuthor}
                    onChange={handleEditFormChange}
                    name="isAuthor"
                  />
                }
                label="Author"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editFormData.isTranslator}
                    onChange={handleEditFormChange}
                    name="isTranslator"
                  />
                }
                label="Translator"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editFormData.includeInPublications}
                    onChange={handleEditFormChange}
                    name="includeInPublications"
                  />
                }
                label="Include this contributor when identifying authors in lists of publications."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editFormData.isPrimaryContact}
                    onChange={handleEditFormChange}
                    name="isPrimaryContact"
                  />
                }
                label="Set as Primary Contact"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveContributor} 
            variant="contained" 
            color="primary"
            disabled={!editFormData.givenName || !editFormData.email}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 