import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo copy.png'; 
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('');
  const navigate = useNavigate();

  // We're focusing on the production endpoint since that's what connected successfully
  const API_BASE_URL = 'https://backend.globaljournal.co.in';

  // Test server connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Simple GET request to check if server is reachable
        await axios.get(`${API_BASE_URL}/admin-login.php`, { timeout: 5000 });
        setServerStatus('Server connection successful');
        console.log('Server connection test successful');
      } catch (err) {
        // Even a 500 error means the server is reachable
        if (err.response) {
          setServerStatus('Server is reachable');
          console.log('Server is reachable but returned an error');
        } else {
          setServerStatus(`Server connection failed: ${err.message}`);
          console.error('Server connection test failed:', err);
        }
      }
    };
    
    testConnection();
  }, []);

  const fetchAdminData = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_BASE_URL}/admin-login.php`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
  
      handleResponse(res);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Login failed.');
      } else {
        setError('Server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleResponse = (res) => {
    console.log('Login response:', res.data);
    
    if (res.data && res.data.success) {
      setAdmin(res.data.user);
      localStorage.setItem('adminUser', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } else {
      setError(res.data?.message || 'Login failed. Please check your credentials.');
      console.error('Not logged in:', res.data?.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    fetchAdminData(email, password);
  };
     
  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <div style={styles.logoSection}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Admin Login</h2>
        </div>

        {serverStatus && serverStatus !== 'Server connection successful' && (
          <div style={styles.warningMessage}>{serverStatus}</div>
        )}

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <div style={styles.rememberRow}>
            <label>
              <input type="checkbox" style={styles.checkbox} />
              Remember me
            </label>
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: 'relative',
    height: '89vh',
    backgroundImage: `url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1470&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 0,
    
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(8px)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '25px',
  },
  logo: {
    height: '70px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1E3A8A',
  },
  warningMessage: {
    backgroundColor: 'rgba(254, 226, 226, 0.9)',
    color: '#B91C1C',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: 'rgba(254, 226, 226, 0.9)',
    color: '#B91C1C',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
  rememberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    marginBottom: '20px',
  },
  checkbox: {
    marginRight: '6px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    opacity: props => props.disabled ? 0.7 : 1,
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
  link: {
    color: '#2563eb',
    marginLeft: '6px',
    textDecoration: 'none',
  },
};

export default AdminLogin;
