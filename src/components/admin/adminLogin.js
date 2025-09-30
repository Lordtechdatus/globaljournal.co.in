import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo copy.png'; 
import axios from 'axios';

const API = 'https://backend.globaljournal.co.in/admin-login.php';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [srv, setSrv] = useState('');
  const nav = useNavigate();

  //error.message {e.message}
  useEffect(() => {
    axios.get(API, { timeout: 5000 })
      .catch(e => setSrv(e.response ? 'Server is reachable' : `Server connection failed: ${e.message}`));
  }, []);

  const login = async e => {
    e.preventDefault();
    if (!email || !pw) return alert('Please enter both email and password.');
    setLoading(true); setErr('');
    try {
      const { data } = await axios.post(API, { email, password: pw }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        timeout: 10000
      });
      if (data?.success) {
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        nav('/dashboard');
      } else setErr(data?.message || 'Login failed. Please check your credentials.');
    } catch (e) {
      setErr(e.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow-x: hidden;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .login-input:focus {
            border-color: #667eea !important;
            background-color: #fff !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
          
          .login-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }
          
          .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
          }
          
          /* Mobile responsiveness */
          @media (max-width: 480px) {
            .login-page {
              padding: 16px !important;
              height: 100vh !important;
              min-height: 100vh !important;
            }
            
            .login-card {
              padding: 32px 24px !important;
              max-height: 95vh !important;
              margin: 0 !important;
            }
          }
          
          /* Tablet responsiveness */
          @media (max-width: 768px) {
            .login-page {
              padding: 20px !important;
            }
            
            .login-card {
              padding: 40px 32px !important;
              max-height: 92vh !important;
            }
          }
          
          /* Custom scrollbar for login card */
          .login-card::-webkit-scrollbar {
            width: 6px;
          }
          
          .login-card::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 3px;
          }
          
          .login-card::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.3);
            border-radius: 3px;
          }
          
          .login-card::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.5);
          }
          
          /* Ensure proper viewport handling */
          @media (max-height: 600px) {
            .login-card {
              max-height: 95vh !important;
              padding: 24px !important;
            }
            
            .login-page {
              align-items: flex-start !important;
              padding-top: 20px !important;
            }
          }
        `}
      </style>
      <div style={styles.page} className="login-page">
        <div style={styles.backgroundPattern}></div>
        <div style={styles.card} className="login-card">
          <div style={styles.logoSection}>
            <img src={logo} alt="Logo" style={styles.logo} />
            <h2 style={styles.title}>Admin Portal</h2>
            <p style={styles.subtitle}>Sign in to your admin account</p>
          </div>
          
          {srv && srv !== 'Server connection successful' && (
            <div style={styles.warningMessage}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {srv}
            </div>
          )}
          
          {err && (
            <div style={styles.errorMessage}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {err}
            </div>
          )}
          
          <form onSubmit={login}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                className="login-input"
                disabled={loading}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                style={styles.input}
                className="login-input"
                disabled={loading}
                required
              />
            </div>
  
            <button 
              type="submit" 
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={styles.loadingSpinner}></div>
                  Signing in...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </div>
              )}
            </button>
          </form>
          
          <div style={styles.footer}>
            <p>
              Need help? 
              <button 
                type="button"
                onClick={() => window.location.href = '/contact'}
                style={{
                  ...styles.link,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    height: '100vh',
    background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 80px, #667eea 80px, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    paddingTop: '100px',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxSizing: 'border-box',
  },
  backgroundPattern: {
    position: 'absolute',
    top: '100px',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '40px 36px',
    borderRadius: '20px',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
    marginTop: '20px',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  logo: {
    height: '70px',
    marginBottom: '14px',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '500',
  },
  warningMessage: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid #fecaca',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid #fecaca',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  inputGroup: {
    marginBottom: '24px',
    position: 'relative',
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '16px',
    transition: 'all 0.2s',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#667eea',
    backgroundColor: '#fff',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  },
  rememberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    marginBottom: '32px',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#667eea',
  },
  checkboxLabel: {
    color: '#64748b',
    fontWeight: '500',
  },
  forgotLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    transform: 'none',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default AdminLogin;
