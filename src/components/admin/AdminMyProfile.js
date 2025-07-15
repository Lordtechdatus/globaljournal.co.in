import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './adminLayout';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get admin data from localStorage first
    const storedAdmin = localStorage.getItem('adminUser');
    
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
        setLoading(false);
      } catch (error) {
        console.error('Error parsing admin data from localStorage', error);
        fetchAdminData();
      }
    } else {
      fetchAdminData();
    }
  }, []);

  const fetchAdminData = () => {
    // const adminEmail = 'admin@globaljournal.com';
    // const adminPassword = 'prateek@2641';
  
    setLoading(true);
  
    axios.post('https://backend.globaljournal.co.in/get-admin-profile.php', {
      withCredentials: true 
    })
    .then(res => {
      if (res.data && res.data.success) {
        setAdmin(res.data.user);
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
      } else {
        console.error('Not logged in');
      }
    })
    .catch(err => {
      console.error('Error fetching admin profile:', err);
    })
    .finally(() => setLoading(false));
  };

  return (
    <AdminLayout>
      <div className="admin-profile-container">
        <style>
          {`
            .admin-profile-container {
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              padding: 28px;
              margin: 20px;
              transition: all 0.3s ease;
            }
            
            .profile-header {
              margin-bottom: 28px;
              border-bottom: 1px solid #f0f0f0;
              padding-bottom: 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .header-left h2 {
              color: #1a3251;
              font-size: 1.8rem;
              font-weight: 600;
              margin-bottom: 8px;
            }
            
            .header-left p {
              color: #6b7280;
              font-size: 1rem;
            }
            
            .refresh-button {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              color: #4b5563;
              padding: 8px 16px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .refresh-button:hover {
              background: #f3f4f6;
              border-color: #d1d5db;
            }
            
            .profile-content {
              display: flex;
              gap: 30px;
            }
            
            .profile-sidebar {
              flex: 0 0 240px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .profile-avatar {
              width: 160px;
              height: 160px;
              border-radius: 50%;
              background: #e5e7eb;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #6b7280;
              font-weight: 600;
              font-size: 3rem;
              margin-bottom: 20px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }
            
            .profile-role {
              background: rgba(26, 50, 81, 0.1);
              color: #1a3251;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 0.9rem;
              font-weight: 500;
              margin-bottom: 16px;
            }
            
            .profile-main {
              flex: 1;
            }
            
            .profile-card {
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              overflow: hidden;
              border: 1px solid #f0f0f0;
            }
            
            .card-header {
              background: #f9fafb;
              padding: 16px 20px;
              border-bottom: 1px solid #f0f0f0;
            }
            
            .card-header h3 {
              color: #1a3251;
              font-size: 1.1rem;
              font-weight: 600;
              margin: 0;
            }
            
            .card-body {
              padding: 0;
            }
            
            .profile-section {
              display: flex;
              border-bottom: 1px solid #f0f0f0;
              padding: 16px 20px;
              transition: background 0.2s;
            }
            
            .profile-section:last-child {
              border-bottom: none;
            }
            
            .profile-section:hover {
              background: rgba(249, 250, 251, 0.5);
            }
            
            .profile-label {
              font-weight: 500;
              width: 150px;
              color: #6b7280;
              margin: 0;
            }
            
            .profile-value {
              flex: 1;
              margin: 0;
              color: #1f2937;
              font-weight: 500;
            }
            
            .loading {
              text-align: center;
              padding: 60px 0;
              color: #6b7280;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 16px;
            }
            
            .loading-spinner {
              border: 4px solid rgba(0, 0, 0, 0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: #1a3251;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .error-state {
              text-align: center;
              padding: 60px 0;
              color: #6b7280;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 16px;
            }
            
            .error-icon {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: #fee2e2;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.5rem;
              color: #ef4444;
            }
            
            .error-text {
              font-size: 1.1rem;
              font-weight: 500;
              color: #4b5563;
              margin-bottom: 8px;
            }
            
            .error-subtext {
              font-size: 0.95rem;
              color: #6b7280;
              max-width: 400px;
            }
            
            .login-button {
              background: #1a3251;
              color: #fff;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
              margin-top: 16px;
            }
            
            .login-button:hover {
              background: #0f2a47;
              transform: translateY(-1px);
            }
          `}
        </style>
        
        <div className="profile-header">
          <div className="header-left">
            <h2>Admin Profile</h2>
            <p>View and manage your profile information</p>
          </div>
          <button className="refresh-button" onClick={fetchAdminData}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <div>Loading profile information...</div>
          </div>
        ) : !admin ? (
          <div className="error-state">
            <div className="error-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
            </div>
            <div className="error-text">No profile data available</div>
            <div className="error-subtext">Please log in again to access your profile information</div>
            <button className="login-button">Log In</button>
          </div>
        ) : (
          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="profile-avatar">
                {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="profile-role">Administrator</div>
            </div>
            
            <div className="profile-main">
              <div className="profile-card">
                <div className="card-header">
                  <h3>Personal Information</h3>
                </div>
                <div className="card-body">
                  <div className="profile-section">
                    <p className="profile-label">Full Name</p>
                    <p className="profile-value">{admin.name || 'Not provided'}</p>
                  </div>
                  
                  <div className="profile-section">
                    <p className="profile-label">Email Address</p>
                    <p className="profile-value">{admin.email || 'Not provided'}</p>
                  </div>
                  
                  <div className="profile-section">
                    <p className="profile-label">Account Created</p>
                    <p className="profile-value">
                      {admin.created_at 
                        ? new Date(admin.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not available'}
                    </p>
                  </div>
                  
                  <div className="profile-section">
                    <p className="profile-label">Last Login</p>
                    <p className="profile-value">
                      {admin.last_login 
                        ? new Date(admin.last_login).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
