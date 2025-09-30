import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './adminLayout';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, sortField, sortDirection]);

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

  const filterAndSortUsers = () => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.affiliation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <AdminLayout>
      <div className="user-list-container">
        <style>
          {`
            .user-list-container {
              background: #fff;
              border-radius: 20px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              padding: 0;
              margin: 0;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .user-list-header {
              padding: 32px 32px 24px;
              border-bottom: 1px solid #e2e8f0;
              background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
              border-radius: 20px 20px 0 0;
            }
            
            .header-content {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 24px;
            }
            
            .header-left h2 {
              color: #1e293b;
              font-size: 2rem;
              font-weight: 700;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            
            .header-left p {
              color: #64748b;
              font-size: 1rem;
              font-weight: 500;
            }
            
            .header-actions {
              display: flex;
              gap: 12px;
              align-items: center;
            }
            
            .refresh-button {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              color: white;
              padding: 12px 20px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              transition: all 0.3s;
              font-weight: 600;
              font-size: 0.9rem;
            }
            
            .refresh-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }
            
            .search-container {
              position: relative;
              width: 100%;
              max-width: 400px;
            }
            
            .search-input {
              width: 100%;
              padding: 12px 16px 12px 48px;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              font-size: 0.95rem;
              transition: all 0.2s;
              background: #f8fafc;
              box-sizing: border-box;
            }
            
            .search-input:focus {
              outline: none;
              border-color: #667eea;
              background: #fff;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .search-icon {
              position: absolute;
              left: 16px;
              top: 50%;
              transform: translateY(-50%);
              color: #64748b;
            }
            
            .stats-row {
              display: flex;
              gap: 24px;
              margin-top: 16px;
            }
            
            .stat-item {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 16px;
              background: rgba(102, 126, 234, 0.1);
              border-radius: 8px;
              font-size: 0.9rem;
              font-weight: 600;
              color: #667eea;
            }
            
            .table-container {
              padding: 32px;
              background: #fff;
            }
            
            .users-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
            }
            
            .users-table th {
              text-align: left;
              padding: 16px 20px;
              background: #f8fafc;
              color: #475569;
              font-weight: 700;
              font-size: 0.85rem;
              text-transform: uppercase;
              letter-spacing: 1px;
              border-bottom: 2px solid #e2e8f0;
              cursor: pointer;
              transition: all 0.2s;
              position: relative;
            }
            
            .users-table th:hover {
              background: #f1f5f9;
              color: #334155;
            }
            
            .sort-indicator {
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }
            
            .sort-arrow {
              width: 16px;
              height: 16px;
              opacity: 0.5;
              transition: all 0.2s;
            }
            
            .sort-arrow.active {
              opacity: 1;
              color: #667eea;
            }
            
            .users-table td {
              padding: 20px;
              border-bottom: 1px solid #f1f5f9;
              color: #334155;
              font-size: 0.95rem;
              vertical-align: middle;
            }
            
            .users-table tr:last-child td {
              border-bottom: none;
            }
            
            .users-table tbody tr {
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .users-table tbody tr:hover {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .user-name {
              font-weight: 600;
              color: #1e293b;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .user-avatar {
              width: 40px;
              height: 40px;
              border-radius: 12px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 700;
              font-size: 1rem;
              flex-shrink: 0;
            }
            
            .user-info {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }
            
            .user-name-text {
              font-size: 0.95rem;
              font-weight: 600;
              color: #1e293b;
            }
            
            .user-email {
              font-size: 0.85rem;
              color: #64748b;
            }
            
            .user-affiliation {
              color: #475569;
              font-size: 0.9rem;
              font-weight: 500;
            }
            
            .user-country {
              display: flex;
              align-items: center;
              gap: 8px;
              font-weight: 500;
              color: #475569;
            }
            
            .country-flag {
              width: 20px;
              height: 20px;
              border-radius: 4px;
              background: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.8rem;
            }
            
            .user-date {
              color: #64748b;
              font-size: 0.9rem;
              font-weight: 500;
            }
            
            .table-index {
              color: #94a3b8;
              font-size: 0.9rem;
              font-weight: 600;
              width: 50px;
            }
            
            .status-badge {
              display: inline-flex;
              align-items: center;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .status-active {
              background: #dcfce7;
              color: #166534;
            }
            
            .status-inactive {
              background: #fef2f2;
              color: #991b1b;
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
          <div className="header-content">
            <div className="header-left">
              <h2>User Management</h2>
              <p>Manage and view all users registered on the platform</p>
            </div>
            <div className="header-actions">
              <button className="refresh-button" onClick={fetchUsers} disabled={loading}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          <div className="search-container">
            <div className="search-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, affiliation, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="stats-row">
            <div className="stat-item">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              Total: {users.length}
            </div>
            <div className="stat-item">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Filtered: {filteredUsers.length}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <div>Loading users...</div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th className="table-index">#</th>
                  <th onClick={() => handleSort('name')}>
                    <div className="sort-indicator">
                      User
                      <svg className={`sort-arrow ${sortField === 'name' ? 'active' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    </div>
                  </th>
                  <th onClick={() => handleSort('affiliation')}>
                    <div className="sort-indicator">
                      Affiliation
                      <svg className={`sort-arrow ${sortField === 'affiliation' ? 'active' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    </div>
                  </th>
                  <th onClick={() => handleSort('country')}>
                    <div className="sort-indicator">
                      Country
                      <svg className={`sort-arrow ${sortField === 'country' ? 'active' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    </div>
                  </th>
                  <th onClick={() => handleSort('created_at')}>
                    <div className="sort-indicator">
                      Joined
                      <svg className={`sort-arrow ${sortField === 'created_at' ? 'active' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    </div>
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td className="table-index">{index + 1}</td>
                    <td>
                      <div className="user-name">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                          <div className="user-name-text">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="user-affiliation">{user.affiliation || 'Not specified'}</td>
                    <td>
                      <div className="user-country">
                        <div className="country-flag">
                          {user.country ? user.country.charAt(0).toUpperCase() : '?'}
                        </div>
                        {user.country || 'Unknown'}
                      </div>
                    </td>
                    <td className="user-date">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </td>
                    <td>
                      <span className="status-badge status-active">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="empty-title">{searchTerm ? 'No matching users found' : 'No users found'}</div>
            <div className="empty-description">
              {searchTerm 
                ? `No users match your search for "${searchTerm}". Try adjusting your search terms.`
                : 'When users register on the platform, they will appear here for easy management.'
              }
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserList;
