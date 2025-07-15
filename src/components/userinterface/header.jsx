import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, useMediaQuery, Avatar } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './header.css';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  transition: 'background-color 0.3s ease-in-out',
  position: 'fixed',
  width: '100%',
  zIndex: 1100,
}));

const ScrolledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  borderBottom: 'none',
  transition: 'all 0.3s ease-in-out',
  position: 'fixed',
  width: '100%',
  zIndex: 1100,
}));

const LogoContainer = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", serif',
  letterSpacing: '0.03em',
  fontWeight: 700,
  fontSize: '1.7rem',
  color: '#1a1a1a',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-4px',
    left: '65px',
    width: '185px',
    height: '3px',
    backgroundColor: '#d32f2f',
  }
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: '45px',
  marginRight: '15px',
  transform: 'rotate(0deg)',
  display: 'inline-block',
  verticalAlign: 'middle',
  [theme.breakpoints.down('sm')]: {
    height: '38px',
    marginRight: '12px',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '40px',
  backgroundColor: alpha(theme.palette.common.black, 0.03),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '260px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: 'all 0.2s ease-in-out',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.black, 0.4),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    fontSize: '0.9rem',
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? '#d32f2f' : '#333',
  fontWeight: active ? 600 : 500,
  padding: '8px 16px',
  textTransform: 'none',
  fontSize: '0.95rem',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'transparent',
    '&::after': {
      width: '70%',
      opacity: 1,
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: active ? '70%' : '0%',
    height: '2px',
    backgroundColor: '#d32f2f',
    transition: 'all 0.2s ease-in-out',
    opacity: active ? 1 : 0,
  }
}));

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [issueMenuAnchor, setIssueMenuAnchor] = useState(null);
  const [homeMenuAnchor, setHomeMenuAnchor] = useState(null);
  const [authorMenuAnchor, setAuthorMenuAnchor] = useState(null);
  const [mobileIssueMenuOpen, setMobileIssueMenuOpen] = useState(false);
  const [mobileHomeMenuOpen, setMobileHomeMenuOpen] = useState(false);
  const [mobileAuthorMenuOpen, setMobileAuthorMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');

  // Check if user is logged in
  useEffect(() => {
    // Check localStorage for user authentication token
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }, [refresh, location.pathname]); // Add refresh state and location.pathname to dependencies

  // Function to refresh the authentication status
  const refreshAuthStatus = () => {
    setRefresh(prev => !prev);
  };

  useEffect(() => {
    // Set up event listener for login events
    window.addEventListener('login', refreshAuthStatus);
    
    // Check auth status on mount
    refreshAuthStatus();
    
    return () => {
      window.removeEventListener('login', refreshAuthStatus);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const handleUserMenu = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);
  
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    handleUserMenuClose();
    refreshAuthStatus(); // Refresh auth status after logout
    navigate('/');
  };
  
  const handleSubmissionClick = (event, closeMenu) => {
    if (!isLoggedIn) {
      event.preventDefault();
      alert('Please login to make a submission');
      closeMenu();
      navigate('/login');
    } else {
      closeMenu();
    }
  };
  
  const handleIssueMenuOpen = (event) => {
    setIssueMenuAnchor(event.currentTarget);
  };

  const handleIssueMenuClose = () => {
    setIssueMenuAnchor(null);
  };
  
  const handleHomeMenuOpen = (event) => {
    setHomeMenuAnchor(event.currentTarget);
  };

  const handleHomeMenuClose = () => {
    setHomeMenuAnchor(null);
  };
  
  const handleAuthorMenuOpen = (event) => {
    setAuthorMenuAnchor(event.currentTarget);
  };

  const handleAuthorMenuClose = () => {
    setAuthorMenuAnchor(null);
  };
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/', dropdown: true,
      subItems: [
        { name: 'About the Journal', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ],
    },
    { name: 'Editorial Team', path: '/editorial-team' },
    { name: 'Issues',dropdown: true,
     subItems: [
        { name: 'CURRENT', path: '/issues/current' },
        { name: 'ARCHIVE', path: '/issues/archive' },
      ],
    },
    { name: 'For Author', path: '/my-author',dropdown: true,
      subItems: [
        { name: 'Announcements', path: '/announcements' },
        { name: 'Author Guidelines', path: '/AuthorGuidelines' },
        { name: 'Submission Guidelines', path: '/SubmissionTemplate' },
        {name: 'Research Ethics Guidelines', path: '/ResearchEthicsGuidelines'},
        {name: 'Submissions', path: '/titlesubmission'},
      ],
     },

    { name: 'Indexing & Metrics'
    }
  ];

  const RenderAppBar = scrolled ? ScrolledAppBar : StyledAppBar;

  const toggleMobileIssueMenu = () => {
    setMobileIssueMenuOpen(!mobileIssueMenuOpen);
    setMobileHomeMenuOpen(false);
    setMobileAuthorMenuOpen(false);
  };

  const toggleMobileHomeMenu = () => {
    setMobileHomeMenuOpen(!mobileHomeMenuOpen);
    setMobileIssueMenuOpen(false);
    setMobileAuthorMenuOpen(false);
  };

  const toggleMobileAuthorMenu = () => {
    setMobileAuthorMenuOpen(!mobileAuthorMenuOpen);
    setMobileHomeMenuOpen(false);
    setMobileIssueMenuOpen(false);
  };

  return (
    <div className="header-container">
      <RenderAppBar>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LogoContainer component={Link} to="/" className="header-logo">
                <LogoImage src="/logo.png" alt="GJCMELogo" />
                Global Journal 
              </LogoContainer>
            </Box>
            {isMobile ? (
              <Box sx={{ flexGrow: 0 }}>
                <IconButton size="large" onClick={handleMenu} color="inherit" className="header-icon">
                  <MenuIcon  style={{ color: '#2d3436' }} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  {navItems.map((item) => (
                    item.dropdown ? (
                      <div key={item.name}>
                        <MenuItem 
                          onClick={
                            item.name === 'Home' 
                              ? toggleMobileHomeMenu 
                              : item.name === 'Issues' 
                                ? toggleMobileIssueMenu 
                                : item.name === 'For Author'
                                  ? toggleMobileAuthorMenu
                                  : null
                          }
                          sx={{ 
                            fontWeight: item.subItems?.some(subItem => isActive(subItem.path)) ? 600 : 400,
                            color: item.subItems?.some(subItem => isActive(subItem.path)) ? '#d32f2f' : 'inherit'
                          }}
                        >
                          {item.name}
                        </MenuItem>
                        {((item.name === 'Home' && mobileHomeMenuOpen) || 
                          (item.name === 'Issues' && mobileIssueMenuOpen) ||
                          (item.name === 'For Author' && mobileAuthorMenuOpen)) && (
                          <Box sx={{ pl: 2, bgcolor: 'rgba(0,0,0,0.02)' }}>
                            {item.subItems?.map((subItem) => (
                              <MenuItem 
                                key={subItem.name} 
                                onClick={(event) => {
                                  if (subItem.name === 'submissions') {
                                    handleSubmissionClick(event, handleClose);
                                  } else {
                                    handleClose();
                                  }
                                }} 
                                component={Link} 
                                to={subItem.name === 'submissions' && !isLoggedIn ? '#' : subItem.path}
                                selected={isActive(subItem.path)}
                                sx={{ 
                                  py: 1,
                                  fontSize: '0.9rem',
                                  color: isActive(subItem.path) ? '#d32f2f' : 'inherit'
                                }}
                              >
                                {subItem.name}
                              </MenuItem>
                            ))}
                          </Box>
                        )}
                      </div>
                    ) : (
                      <MenuItem key={item.name} onClick={handleClose} component={Link} to={item.path} selected={isActive(item.path)}>
                        {item.name}
                      </MenuItem>
                    )
                  ))}
                  {!isLoggedIn ? (
                    <>
                      <MenuItem onClick={handleClose} component={Link} to="/login">
                        Login
                      </MenuItem>
                      <MenuItem onClick={handleClose} component={Link} to="/signup">
                        Sign Up
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={handleClose} component={Link} to="/profile">
                        My Profile
                      </MenuItem>
                      <MenuItem onClick={handleClose} component={Link} to="/submissions">
                        My Submissions
                      </MenuItem>
                      <MenuItem onClick={handleClose} component={Link} to="/titlesubmission">
                        Make a Submission
                      </MenuItem>
                      <MenuItem onClick={() => {handleClose(); handleLogout();}}>
                        Logout
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2 }}>
                  {navItems.map((item) => (
                    item.dropdown ? (
                      <Box 
                        key={item.name} 
                        sx={{ display: 'inline-block', position: 'relative' }}
                      >
                        <NavButton 
                          active={item.subItems?.some(subItem => isActive(subItem.path))}
                          aria-owns={item.name === 'Home' ? 'home-menu' : item.name === 'Issues' ? 'issue-menu' : 'author-menu'}
                          aria-haspopup="true"
                          onClick={item.name === 'Home' ? handleHomeMenuOpen : item.name === 'Issues' ? handleIssueMenuOpen : handleAuthorMenuOpen}
                        >
                          {item.name}
                        </NavButton>
                        <Menu
                          id={item.name === 'Home' ? 'home-menu' : item.name === 'Issues' ? 'issue-menu' : 'author-menu'}
                          anchorEl={item.name === 'Home' ? homeMenuAnchor : item.name === 'Issues' ? issueMenuAnchor : authorMenuAnchor}
                          open={item.name === 'Home' ? Boolean(homeMenuAnchor) : item.name === 'Issues' ? Boolean(issueMenuAnchor) : Boolean(authorMenuAnchor)}
                          onClose={item.name === 'Home' ? handleHomeMenuClose : item.name === 'Issues' ? handleIssueMenuClose : handleAuthorMenuClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          PaperProps={{
                            elevation: 2,
                            sx: { 
                              mt: 0.5,
                              minWidth: 150,
                              borderRadius: '4px',
                            }
                          }}
                        >
                          {item.subItems?.map((subItem) => (
                            <MenuItem 
                              key={subItem.name} 
                              onClick={(event) => {
                                if (subItem.name === 'submissions') {
                                  handleSubmissionClick(event, item.name === 'Home' ? handleHomeMenuClose : item.name === 'Issues' ? handleIssueMenuClose : handleAuthorMenuClose);
                                } else {
                                  item.name === 'Home' ? handleHomeMenuClose() : item.name === 'Issues' ? handleIssueMenuClose() : handleAuthorMenuClose();
                                }
                              }} 
                              component={Link} 
                              to={subItem.name === 'submissions' && !isLoggedIn ? '#' : subItem.path}
                              selected={isActive(subItem.path)}
                              sx={{ 
                                color: isActive(subItem.path) ? '#d32f2f' : 'inherit',
                                fontSize: '0.9rem',
                                py: 1
                              }}
                            >
                              {subItem.name}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                    ) : (
                      <NavButton key={item.name} active={isActive(item.path)} component={Link} to={item.path}>
                        {item.name}
                      </NavButton>
                    )
                  ))}
                </Box>
                <Box sx={{ display: 'flex' }}>
                  {/* <IconButton color="#fff" size="small" sx={{ ml: 1 }}> */}
                    {/* <BookmarkBorderIcon /> */}
                  {/* </IconButton> */}
                  {isLoggedIn ? (
                    <>
                      <IconButton 
                        color="primary" 
                        size="small" 
                        sx={{ 
                          ml: 1,
                          bgcolor: '#f0f2f5',
                          '&:hover': {
                            bgcolor: '#e4e6e8',
                          },
                          padding: '8px'
                        }}
                        onClick={handleUserMenu}
                      >
                        <AccountCircleIcon sx={{ color: '#d32f2f' }} />
                      </IconButton>
                      <Menu
                        anchorEl={userMenuAnchorEl}
                        open={Boolean(userMenuAnchorEl)}
                        onClose={handleUserMenuClose}
                      >
                        <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
                          My Profile
                        </MenuItem>
                        <MenuItem component={Link} to="/submissions" onClick={handleUserMenuClose}>
                          My Submissions
                        </MenuItem>
                        <MenuItem component={Link} to="/titlesubmission" onClick={handleUserMenuClose}>
                          Make a Submission
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="text"
                        size="small"
                        sx={{ 
                          ml: 1,
                          color: '#d32f2f',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                          },
                          textTransform: 'none',
                          fontWeight: 500
                        }} 
                        component={Link} 
                        to="/login"
                      >
                        Login
                      </Button>
                      <Button 
                        variant="outlined"
                        size="small"
                        sx={{ 
                          ml: 1,
                          borderColor: '#d32f2f',
                          color: '#d32f2f',
                          '&:hover': {
                            borderColor: '#b71c1c',
                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                          },
                          textTransform: 'none',
                          fontWeight: 500
                        }} 
                        component={Link} 
                        to="/signup"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                  
                </Box>
              </Box>
            )}
          </Toolbar>
        </Container>
      </RenderAppBar>
    </div>
  );
};

export default Header;
