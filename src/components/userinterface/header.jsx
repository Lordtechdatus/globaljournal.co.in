import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, useMediaQuery, Avatar } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import './header.css';
import Drawer from '@mui/material/Drawer';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDropdownOpen, setDrawerDropdownOpen] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }, [refresh, location.pathname]); // Add refresh state and location.pathname to dependencies

  const refreshAuthStatus = () => {
    setRefresh(prev => !prev);
  };

  useEffect(() => {
    window.addEventListener('login', refreshAuthStatus);
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
    {
      name: 'Home',
      path: '/',
      icon: <HomeIcon />,
      dropdown: false,
    },
    {
      name: 'About Us',
      path: '/about-us',
      dropdown: true,
      subItems: [
        { name: 'About Us', path: '/about' },
        { name: 'Aim & Scope', path: '/aim-scope' },
      ],
    },
    { name: 'Contact', path: '/contact' },
    { name: 'Editorial Board', path: '/editorial-team' },
    { name: 'Current/Archive',dropdown: true,
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
        {name: 'Peer Review', path: '/peerReview'},
      ],
     },

    { name: 'Indexing & Metrics'
    }
  ];

  const RenderAppBar = scrolled ? ScrolledAppBar : StyledAppBar;

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleDrawerDropdownToggle = (name) => {
    setDrawerDropdownOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="header-container">
      <RenderAppBar>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, minHeight: '64px !important' }}>
            {/* Left: Logo + Journal Name */}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', minWidth: 0, whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none', color: 'inherit' }}>
              <LogoImage src="/logo.webp" alt="GJCMELogo" style={{ marginRight: 12 }} />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', sm: '1.5rem' },
                  letterSpacing: '0.03em',
                  color: '#1a1a1a',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  marginRight: 3,
                  display: 'inline-block',
                }}
              >
                Global Journal
              </Typography>
            </Box>
            {/* Desktop Nav Links */}
            {!isMobile && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-evenly',
                gap: '0.3rem',
                minWidth: 0,
                overflow: 'hidden'
              }}>
                {navItems.map((item) => (
                  item.dropdown ? (
                    <Box key={item.name} sx={{ display: 'inline-block', position: 'relative' }}>
                      <NavButton
                        active={item.subItems?.some(subItem => isActive(subItem.path)) || isActive(item.path)}
                        aria-owns={item.name === 'About Us' ? 'about-menu' : item.name === 'Current/Archive' ? 'issue-menu' : item.name === 'For Author' ? 'author-menu' : undefined}
                        aria-haspopup="true"
                        onClick={item.name === 'About Us' ? handleHomeMenuOpen : item.name === 'Current/Archive' ? handleIssueMenuOpen : handleAuthorMenuOpen}
                        sx={{ px: 2, whiteSpace: 'nowrap' }}
                      >
                        {item.icon && item.name === 'Home' ? (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</Box>
                        ) : (
                          <>
                            {item.icon && <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>{item.icon}</Box>}
                            {item.name}
                          </>
                        )}
                      </NavButton>
                      <Menu
                        id={item.name === 'About Us' ? 'about-menu' : item.name === 'Current/Archive' ? 'issue-menu' : 'author-menu'}
                        anchorEl={item.name === 'About Us' ? homeMenuAnchor : item.name === 'Current/Archive' ? issueMenuAnchor : authorMenuAnchor}
                        open={item.name === 'About Us' ? Boolean(homeMenuAnchor) : item.name === 'Current/Archive' ? Boolean(issueMenuAnchor) : Boolean(authorMenuAnchor)}
                        onClose={item.name === 'About Us' ? handleHomeMenuClose : item.name === 'Current/Archive' ? handleIssueMenuClose : handleAuthorMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        PaperProps={{ elevation: 2, sx: { mt: 0.5, minWidth: 150, borderRadius: '4px' } }}
                      >
                        {item.subItems?.map((subItem) => (
                          <MenuItem
                            key={subItem.name}
                            onClick={(event) => {
                              if (subItem.name === 'submissions') {
                                handleSubmissionClick(event, item.name === 'About Us' ? handleHomeMenuClose : item.name === 'Current/Archive' ? handleIssueMenuClose : handleAuthorMenuClose);
                              } else {
                                item.name === 'About Us' ? handleHomeMenuClose() : item.name === 'Current/Archive' ? handleIssueMenuClose() : handleAuthorMenuClose();
                              }
                            }}
                            component={Link}
                            to={subItem.name === 'submissions' && !isLoggedIn ? '#' : subItem.path}
                            selected={isActive(subItem.path)}
                            sx={{ color: isActive(subItem.path) ? '#d32f2f' : 'inherit', fontSize: '0.9rem', py: 1 }}
                          >
                            {subItem.name}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ) : (
                    <NavButton key={item.name} active={isActive(item.path)} component={Link} to={item.path} sx={{ px: 2, whiteSpace: 'nowrap' }}>
                      {item.icon && item.name === 'Home' ? (
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</Box>
                      ) : (
                        <>
                          {item.icon && <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>{item.icon}</Box>}
                          {item.name}
                        </>
                      )}
                    </NavButton>
                  )
                ))}
              </Box>
            )}
            {/* Mobile Hamburger Icon */}
            {isMobile && (
              <IconButton
                edge="end"
                aria-label="menu"
                onClick={handleDrawerOpen}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            {/* Right: Login/Sign Up (Desktop) */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                {isLoggedIn ? (
                  <>
                    <IconButton
                      color="primary"
                      size="small"
                      sx={{
                        bgcolor: '#f0f2f5',
                        '&:hover': { bgcolor: '#e4e6e8' },
                        p: '8px',
                      }}
                      onClick={handleUserMenu}
                    >
                      <AccountCircleIcon sx={{ color: '#d32f2f' }} />
                    </IconButton>
                    <Menu anchorEl={userMenuAnchorEl} open={Boolean(userMenuAnchorEl)} onClose={handleUserMenuClose}>
                      <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>My Profile</MenuItem>
                      <MenuItem component={Link} to="/submissions" onClick={handleUserMenuClose}>My Submissions</MenuItem>
                      <MenuItem component={Link} to="/titlesubmission" onClick={handleUserMenuClose}>Make a Submission</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: '#d32f2f', textTransform: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}
                      component={Link}
                      to="/login"
                    >
                      Login
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderColor: '#d32f2f', color: '#d32f2f', textTransform: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}
                      component={Link}
                      to="/signup"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
        {/* Mobile Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
          <Box sx={{ width: 260, p: 2 }} role="presentation" onClick={handleDrawerClose}>
            
            {/* Nav Links (vertical) */}
            {navItems.map((item) => (
              <Box key={item.name} sx={{ mb: 1 }}>
                {item.dropdown ? (
                  <>
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleDrawerDropdownToggle(item.name); }}
                      endIcon={drawerDropdownOpen[item.name] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', color: '#000', fontWeight: 600, textAlign: 'left', pl: 0, pr: 1, py: 1 }}
                    >
                      {item.name}
                    </Button>
                    <Collapse in={drawerDropdownOpen[item.name]} timeout="auto" unmountOnExit>
                      {item.subItems?.map((subItem) => (
                        <Button
                          key={subItem.name}
                          component={Link}
                          to={subItem.path}
                          sx={{ display: 'block', textAlign: 'left', width: '100%', color: isActive(subItem.path) ? '#000' : '#333', fontWeight: isActive(subItem.path) ? 600 : 400, pl: 3, py: 0.5 }}
                          onClick={(event) => {
                            if (subItem.name === 'submissions' && !isLoggedIn) {
                              event.preventDefault();
                              alert('Please login to make a submission');
                              navigate('/login');
                            }
                          }}
                        >
                          {subItem.name}
                        </Button>
                      ))}
                    </Collapse>
                  </>
                ) : (
                  <Button
                    component={Link}
                    to={item.path}
                    sx={{ display: 'block', textAlign: 'left', width: '100%', color: isActive(item.path) ? '#d32f2f' : '#333', fontWeight: isActive(item.path) ? 600 : 400, pl: 2, py: 0.5 }}
                  >
                    {item.icon && item.name === 'Home' ? (
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1, verticalAlign: 'middle' }}>
                        {item.icon}
                        <span style={{ marginLeft: 8, verticalAlign: 'middle', display: 'inline-block' }}>Home</span>
                      </Box>
                    ) : (
                      item.name
                    )}
                  </Button>
                )}
              </Box>
            ))}
            <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
              {isLoggedIn ? (
                <React.Fragment>
                  <Button component={Link} to="/profile" sx={{ display: 'block', width: '100%', textAlign: 'left', color: '#333', mb: 1 }}>My Profile</Button>
                  <Button component={Link} to="/submissions" sx={{ display: 'block', width: '100%', textAlign: 'left', color: '#333', mb: 1 }}>My Submissions</Button>
                  <Button component={Link} to="/titlesubmission" sx={{ display: 'block', width: '100%', textAlign: 'left', color: '#333', mb: 1 }}>Make a Submission</Button>
                  <Button onClick={handleLogout} sx={{ display: 'block', width: '100%', textAlign: 'left', color: '#d32f2f', fontWeight: 600 }}>Logout</Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Button component={Link} to="/login" sx={{ display: 'block', width: '100%', textAlign: 'left', color: '#d32f2f', fontWeight: 600, mb: 1 }}>Login</Button>
                  <Button component={Link} to="/signup" sx={{ display: 'block', width: '100%', textAlign: 'left', color: '#d32f2f', fontWeight: 600 }}>Sign Up</Button>
                </React.Fragment>
              )}
            </Box>
          </Box>
        </Drawer>
      </RenderAppBar>
    </div>
  );
};

export default Header;
