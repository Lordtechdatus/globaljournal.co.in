import React, { useState, useRef } from 'react';
import {
  Container, Box, Paper, Typography, Button, 
  Stepper, Step, StepLabel, Divider, useTheme,
  List, ListItem, ListItemText, ListItemIcon, Grid,
  IconButton, CircularProgress, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../../utils/authUtils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

const UploadBox = styled(Box)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '40px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
}));

// Helper function to get alpha color
function alpha(color, value) {
  return color + Math.round(value * 255).toString(16).padStart(2, '0');
}

export default function SubmissionUpload() {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // Second step in the stepper
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();
  
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
    alert('Your submission has been saved for later.');
  };

  const validateFile = (file) => {
    const allowedExtensions = ['doc', 'docx'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      setErrorMessage('Only DOC or DOCX files are allowed');
      return false;
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds the maximum limit of 50MB');
      return false;
    }
    
    return true;
  };

  const uploadFileToServer = async (file) => {
    setIsUploading(true);
    setErrorMessage('');
    
    try {
      const userToken = JSON.parse(localStorage.getItem('userToken'));
      const id = userToken.id;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', id);
      
      const response = await fetch('https://backend.globaljournal.co.in/upload.php', {
        method: 'POST',
        body: formData,
        credentials: 'include' 
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store the server file name in the file object
        const updatedFile = {
          ...file,
          serverFileName: result.fileName,
          uploadSuccess: true,
          size: file.size || 0 // Ensure size is always defined
        };
        return updatedFile;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.message || 'An error occurred during upload');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    for (const file of selectedFiles) {
      if (validateFile(file)) {
        const uploadedFile = await uploadFileToServer(file);
        if (uploadedFile) {
          setFiles(prevFiles => [...prevFiles, uploadedFile]);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
      }
    }
    
    // Clear the file input
    fileInputRef.current.value = '';
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragActive(false);
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    
    for (const file of droppedFiles) {
      if (validateFile(file)) {
        const uploadedFile = await uploadFileToServer(file);
        if (uploadedFile) {
          setFiles(prevFiles => [...prevFiles, uploadedFile]);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleAddFile = () => {
    openFileDialog();
  };

  const handleBack = () => {
    navigate('/submission-detail');
  };

  const handleContinue = () => {
    // Save files data to localStorage before navigating
    try {
      // Store only necessary file information including server file names
      const filesData = files.map(file => ({
        name: file.serverFileName,
        size: file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown size',
        type: file.type?.includes('document') ? 'Manuscript' : 'Supplementary Material',
        serverFileName: file.serverFileName // Store the server-generated filename
      }));
      
      localStorage.setItem('submissionFiles', JSON.stringify(filesData));
      
      // Navigate to the contributors page
      navigate('/submission-contributors');
    } catch (error) {
      console.error('Error saving files data:', error);
      setErrorMessage('An error occurred while saving your files. Please try again.');
    }
  };

  const handleDeleteFile = (indexToDelete) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Make a Submission: Upload Files</Typography>
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
            Upload Files
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Provide any files our editorial team may need to evaluate your submission. Please upload DOC or DOCX files only.
          </Typography>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          
          {uploadSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              File uploaded successfully!
            </Alert>
          )}
          
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
                  Files
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<AddIcon />} 
                    onClick={handleAddFile}
                    disabled={isUploading}
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                    }}
                  >
                    Add File
                  </Button>
                </Box>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".doc,.docx"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                
                {files.length > 0 ? (
                  <List sx={{ width: '100%', overflow: 'auto', maxHeight: '300px' }}>
                    {files.map((file, index) => (
                      <ListItem 
                        key={index} 
                        sx={{ p: 1 }}
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => handleDeleteFile(index)}
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                          <InsertDriveFileIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={file.serverFileName}
                          secondary={file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown size'} 
                          primaryTypographyProps={{ 
                            noWrap: true,
                            title: file.serverFileName, // Add tooltip on hover
                            style: { 
                              maxWidth: '160px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No files uploaded yet
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
                  Upload DOC or DOCX files for your submission
                </Typography>
                
                <UploadBox 
                  onClick={openFileDialog}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  isDragActive={isDragActive}
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '250px'
                  }}
                >
                  {isUploading ? (
                    <CircularProgress sx={{ mb: 2 }} />
                  ) : (
                    <FileUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  )}
                  <Typography variant="h6" gutterBottom>Drag and drop files here</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    or
                  </Typography>
                  <UploadButton 
                    variant="contained" 
                    color="primary"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </UploadButton>
                  <Typography variant="body2" color="text.secondary">
                    Accepted formats: DOC, DOCX • Maximum file size: 50MB
                  </Typography>
                </UploadBox>
              </Grid>
            </Grid>
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
                Last saved 13 minutes ago
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
                disabled={files.length === 0 || isUploading}
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