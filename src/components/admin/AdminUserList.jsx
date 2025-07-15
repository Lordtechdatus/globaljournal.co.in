import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './adminLayout';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios.get("https://backend.globaljournal.co.in/get-users.php")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading users:", err);
        setLoading(false);
      });
  };

  return (
    <AdminLayout>
      <div className="user-list-container">
        <style>
          {`
            .user-list-container {
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              padding: 28px;
              margin: 20px;
              transition: all 0.3s ease;
            }
            
            .user-list-header {
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
            
            .users-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-top: 10px;
            }
            
            .users-table th {
              text-align: left;
              padding: 16px;
              background: #f9fafb;
              color: #4b5563;
              font-weight: 600;
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .users-table td {
              padding: 16px;
              border-bottom: 1px solid #f0f0f0;
              color: #1f2937;
              font-size: 0.95rem;
            }
            
            .users-table tr:last-child td {
              border-bottom: none;
            }
            
            .users-table tr {
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .users-table tr:hover {
              background: rgba(249, 250, 251, 0.5);
              transform: translateY(-1px);
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            
            .user-name {
              font-weight: 500;
              color: #1a3251;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .user-avatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #e5e7eb;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #6b7280;
              font-weight: 600;
              font-size: 0.9rem;
            }
            
            .user-email {
              color: #4b5563;
            }
            
            .user-affiliation {
              color: #6b7280;
              font-size: 0.9rem;
            }
            
            .user-country {
              display: flex;
              align-items: center;
              gap: 6px;
            }
            
            .user-date {
              color: #6b7280;
              font-size: 0.9rem;
            }
            
            .table-index {
              color: #9ca3af;
              font-size: 0.9rem;
              width: 40px;
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
            
            .empty-state {
              text-align: center;
              padding: 60px 0;
              color: #6b7280;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 16px;
            }
            
            .empty-icon {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: #f3f4f6;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.5rem;
              color: #9ca3af;
            }
            
            .empty-text {
              font-size: 1.1rem;
              font-weight: 500;
              color: #4b5563;
              margin-bottom: 8px;
            }
            
            .empty-subtext {
              font-size: 0.95rem;
              color: #6b7280;
              max-width: 400px;
            }
          `}
        </style>
        
        <div className="user-list-header">
          <div className="header-left">
            <h2>Registered Users</h2>
            <p>Manage and view all users registered on the platform</p>
          </div>
          <button className="refresh-button" onClick={fetchUsers}>
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
            <div>Loading users...</div>
          </div>
        ) : users.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th className="table-index">#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Affiliation</th>
                <th>Country</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td className="table-index">{index + 1}</td>
                  <td>
                    <div className="user-name">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-affiliation">{user.affiliation}</td>
                  <td className="user-country">
                    {user.country}
                  </td>
                  <td className="user-date">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
              </svg>
            </div>
            <div className="empty-text">No users found</div>
            <div className="empty-subtext">When users register on the platform, they will appear here.</div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserList;
