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
    <div style={styles.page}>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Admin Login</h2>
        </div>
        {srv && srv !== 'Server connection successful' && (
          <div style={styles.warningMessage}>{srv}</div>
        )}
        {err && <div style={styles.errorMessage}>{err}</div>}
        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
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
    backgroundImage: `url('/adminpagebackimg.webp')`,
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
