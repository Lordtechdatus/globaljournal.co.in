import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Checks if the user is logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
export const isLoggedIn = () => {
  const token = localStorage.getItem('userToken');
  return !!token;
};

/**
 * Handles redirection for pages that require authentication
 * @param {boolean} redirectToLogin - Whether to redirect to login page if not authenticated
 * @param {Function} navigate - The navigate function from useNavigate hook
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const requireAuth = (navigate, showAlert = false) => {
  if (!isLoggedIn()) {
    if (showAlert) {
      alert('Please login to access this page');
    }
    navigate('/login');
    return false;
  }
  return true;
};

/**
 * Custom hook to handle requiring authentication for a page
 * @param {boolean} redirectToLogin - Whether to redirect to login page if not authenticated
 * @param {boolean} showAlert - Whether to show an alert when redirecting
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const useRequireAuth = (redirectToLogin = true, showAlert = false) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  
  useEffect(() => {
    const authenticated = isLoggedIn();
    setIsAuthenticated(authenticated);
    
    if (redirectToLogin && !authenticated) {
      if (showAlert) {
        alert('Please login to access this page');
      }
      navigate('/login');
    }
  }, [redirectToLogin, showAlert, navigate]);
  
  return isAuthenticated;
}; 