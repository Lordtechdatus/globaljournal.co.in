import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Tabs, Tab, Paper, Button, InputBase,
  IconButton, Tooltip, CircularProgress, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../../utils/authUtils';
import ApiService from '../../Services/FetchNodeAdminServices';
import './styles.css';
import DOMPurify from 'dompurify';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  animation: 'slideRight 0.5s ease-out both',
}));

const EmbeddedStyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 0,
  boxShadow: 'none',
  animation: 'slideRight 0.5s ease-out both',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #e0e0e0',
  borderRadius: 4,
  padding: '0 10px',
  height: 40,
  width: '100%',
  maxWidth: 300,
  animation: 'slideRight 0.5s ease-out both',
  animationDelay: '100ms',
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  borderRadius: 16,
  fontWeight: 500,
  fontSize: '0.75rem',
  backgroundColor: status === 'Incomplete' ? '#ffeee6' : '#e6f7ec',
  color: status === 'Incomplete' ? '#d32f2f' : '#2e7d32',
  border: `1px solid ${status === 'Incomplete' ? '#ffc8b7' : '#b7e1cd'}`,
  animation: 'fadeIn 0.5s ease-out both',
}));

const AnimatedBox = styled(Box)(({ delay = 0 }) => ({
  animation: 'slideRight 0.5s ease-out both',
  animationDelay: `${delay}ms`,
}));

const AnimatedTypography = styled(Typography)(({ delay = 0 }) => ({
  animation: 'slideRight 0.5s ease-out both',
  animationDelay: `${delay}ms`,
}));

const AnimatedButton = styled(Button)(({ delay = 0 }) => ({
  animation: 'slideRight 0.5s ease-out both',
  animationDelay: `${delay}ms`,
}));

export default function Submissions({ isEmbedded = false }) {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [submissionList, setSubmissionList] = useState([]);
  const navigate = useNavigate();

  // Always call the hook unconditionally
  // When embedded, we don't need to redirect (first param is false)
  // When not embedded, we do want to show alerts (second param is true)
  const isAuthenticated = useRequireAuth(!isEmbedded, !isEmbedded);

  // Fetch submissions when component mounts
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const userToken = localStorage.getItem('userToken');
        let submitted_by = null;
        
        if (userToken) {
          try {
            const parsedToken = JSON.parse(userToken);
            submitted_by = parsedToken.id;
          } catch (error) {
            console.error("Failed to parse userToken:", error);
          }
        }

        
        // Call the API to get submissions
        const response = await ApiService.post(`get_submissions.php?submitted_by=${submitted_by}`, {});
        
        if (response.success && response.submissions) {
          setSubmissionList(response.submissions);
        } else {
          // If there's no submissions or API unsuccessful
          setSubmissionList([]);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setSubmissionList([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  // If embedded or authenticated, continue rendering
  // Otherwise, the hook will handle redirecting
  if (!isEmbedded && !isAuthenticated) {
    return <CircularProgress />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewSubmission = (submissionId) => {
    // Store the submissionId in localStorage to access it in the submission review page
    localStorage.setItem('currentSubmissionId', submissionId);
    // Navigate to the submission review page
    navigate('/submission-review');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // Call API to delete the submission
      const response = await ApiService.post('delete_submission.php', { submissionId: id });
      
      if (response.success) {
        // Remove from local state if API call was successful
        setSubmissionList(prev => prev.filter(submission => (submission.id || submission._id) !== id));
      } else {
        alert('Failed to delete submission. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('An error occurred while deleting the submission.');
    } finally {
      setLoading(false);
    }
  };

  // Filter submissions based on search query
  const filteredSubmissions = submissionList.filter(submission => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (submission.title && submission.title.toLowerCase().includes(searchLower)) ||
      (submission.abstract && submission.abstract.toLowerCase().includes(searchLower)) ||
      (submission.keywords && submission.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      ))
    );
  });

  // Choose the appropriate container and Paper component based on whether the component is embedded
  const PaperComponent = isEmbedded ? EmbeddedStyledPaper : StyledPaper;
  const ContentWrapper = ({ children }) => {
    return isEmbedded ? (
      <>{children}</>
    ) : (
      <Container maxWidth="lg" sx={{ py: 6 }}>{children}</Container>
    );
  };

  return (
    <ContentWrapper>
      {!isEmbedded && (
        <AnimatedTypography variant="h4" component="h1" gutterBottom>
          Submissions
        </AnimatedTypography>
      )}

      <AnimatedBox sx={{ borderBottom: 1, borderColor: 'divider', mt: isEmbedded ? 0 : 3 }} delay={100}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="submission tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={<Box sx={{ display: 'flex', alignItems: 'center' }}>My Queue <Chip size="small" label={submissionList.length} sx={{ ml: 1, height: 20, fontSize: '0.75rem' }} /></Box>} />
          <Tab label="Archived" />
        </Tabs>
      </AnimatedBox>

      <AnimatedBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }} delay={200}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchContainer>
            <InputBase
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ ml: 1, flex: 1 }}
            />
            <IconButton type="button" sx={{ p: '5px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </SearchContainer>
          <IconButton sx={{ ml: 1 }} aria-label="filter">
            <FilterListIcon />
          </IconButton>
        </Box>

        <Box className="animate-slide" style={{animationDelay: '300ms'}}>
          <AnimatedButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/titlesubmission"
            sx={{ textTransform: 'none' }}
            delay={350}
          >
            New Submission
          </AnimatedButton>
          <Tooltip title="Help">
            <IconButton sx={{ ml: 1 }}>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </AnimatedBox>

      <PaperComponent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {tabValue === 0 && (
              <Box>
                {filteredSubmissions.length > 0 ? filteredSubmissions.map((submission, index) => (
                  <AnimatedBox 
                    key={submission.id || submission._id}
                    delay={400 + (index * 50)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      py: 2,
                      borderBottom: '1px solid #eaeaea'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
              <Typography
    variant="subtitle1"
    fontWeight="medium"
    component="div"
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(submission.title || 'No title'),
    }}
  />
  <Typography variant="body2" color="text.secondary">
    {submission.abstract
      ? submission.abstract.replace(/<[^>]+>/g, '').substring(0, 100) + '...'
      : 'No abstract available'}
  </Typography>
</Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StatusChip 
                          label={submission.status || "Submitted"} 
                          status={submission.status || "Submitted"}
                          size="small"
                        />
                        <Button 
                          variant="outlined"
                          onClick={() => handleViewSubmission(submission.id || submission._id)}
                          sx={{ ml: 2, textTransform: 'none' }}
                          className="animate-slide"
                          style={{animationDelay: `${450 + (index * 50)}ms`}}
                        >
                          View
                        </Button>
                        <IconButton 
                          size="small" 
                          sx={{ ml: 1 }}
                          onClick={() => toggleExpand(submission.id || submission._id)}
                        >
                          {expanded[submission.id || submission._id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {expanded[submission.id || submission._id] && (
                      <>
                       <Typography
                        variant="h6"
                        component="div"
                        dangerouslySetInnerHTML={{ __html: submission.title }}
                      />

                      <Box sx={{ mt: 2 }} className="animate-slide" style={{ animationDelay: `${500 + (index * 50)}ms` }}>
                        <Typography variant="body2">
                          <strong>Keywords:</strong> {submission.keywords ? submission.keywords.join(', ') : 'No keywords available'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Last activity recorded on {submission.updatedAt ? new Date(submission.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }} className="animate-slide" style={{ animationDelay: `${550 + (index * 50)}ms` }}>
                        <Button 
                          color="secondary" 
                          variant="outlined"
                          onClick={() => handleDelete(submission.id || submission._id)}
                          sx={{ textTransform: 'none' }}
                        >
                          Delete
                        </Button>
                      </Box>

                      </>
                    )}
                  </AnimatedBox>
                )) : (
                  <AnimatedBox sx={{ py: 4, textAlign: 'center' }} delay={400}>
                    <Typography variant="body1" color="text.secondary">
                      No submissions found in your queue.
                    </Typography>
                  </AnimatedBox>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <AnimatedBox sx={{ py: 4, textAlign: 'center' }} delay={400}>
                <Typography variant="body1" color="text.secondary">
                  No archived submissions found.
                </Typography>
              </AnimatedBox>
            )}
          </>
        )}
      </PaperComponent>
    </ContentWrapper>
  );
} 