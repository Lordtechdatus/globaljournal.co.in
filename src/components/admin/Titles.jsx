import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './adminLayout';

const Titles = () => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = () => {
    setLoading(true);
    axios.get("https://backend.globaljournal.co.in/get-titlesadmin.php")
      .then(res => {
        setTitles(res.data || []); 
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading titles:", err);
        setLoading(false);
      });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleReviewClick = (e, title) => {
    e.stopPropagation();
    setSelectedTitle(title);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedTitle(null);
  };

  const filteredTitles = titles.filter(title => {
    // Apply search filter
    const matchesSearch = title.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         title.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         title.submitted_by.toLowerCase().includes(searchQuery.toLowerCase());
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || title.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AdminLayout>
      <div className="titles-container">
        <style>
          {`
            .titles-container {
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              padding: 28px;
              margin: 20px;
              transition: all 0.3s ease;
            }
            
            .titles-header {
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
            
            .titles-filters {
              display: flex;
              flex-wrap: wrap;
              gap: 16px;
              margin-bottom: 24px;
              align-items: center;
            }
            
            .search-box {
              flex: 1;
              min-width: 240px;
              display: flex;
              align-items: center;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 0 12px;
            }
            
            .search-box input {
              flex: 1;
              border: none;
              background: transparent;
              padding: 10px 8px;
              font-size: 0.95rem;
              color: #4b5563;
              outline: none;
            }
            
            .search-icon {
              color: #9ca3af;
            }
            
            .filter-group {
              display: flex;
              gap: 8px;
            }
            
            .filter-btn {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              color: #4b5563;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s;
              font-size: 0.9rem;
            }
            
            .filter-btn.active {
              background: #1a3251;
              border-color: #1a3251;
              color: #fff;
            }
            
            .titles-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-top: 10px;
            }
            
            .titles-table th {
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
            
            .titles-table td {
              padding: 16px;
              border-bottom: 1px solid #f0f0f0;
              color: #1f2937;
              font-size: 0.95rem;
            }
            
            .titles-table tr:last-child td {
              border-bottom: none;
            }
            
            .titles-table tr {
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .titles-table tr:hover {
              background: rgba(249, 250, 251, 0.5);
              transform: translateY(-1px);
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            
            .title-name {
              font-weight: 500;
              color: #1a3251;
            }
            
            .title-author {
              color: #4b5563;
              font-size: 0.95rem;
            }
            

            
            .title-date {
              color: #6b7280;
              font-size: 0.9rem;
            }
            
            .status-badge {
              padding: 4px 10px;
              border-radius: 20px;
              font-size: 0.85rem;
              font-weight: 500;
              display: inline-block;
            }
            
            .status-approved {
              background: rgba(16, 185, 129, 0.1);
              color: #10b981;
            }
            
            .status-pending {
              background: rgba(245, 158, 11, 0.1);
              color: #f59e0b;
            }
            
            .status-rejected {
              background: rgba(239, 68, 68, 0.1);
              color: #ef4444;
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
            
            .action-button {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              color: #4b5563;
              padding: 6px 12px;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s;
              font-size: 0.85rem;
              margin-right: 8px;
            }
            
            .action-button:hover {
              background: #f3f4f6;
              border-color: #d1d5db;
            }
            
            .action-button.primary {
              background: #1a3251;
              border-color: #1a3251;
              color: #fff;
            }
            
            .action-button.primary:hover {
              background: #0f2a47;
            }
            
            .action-button.danger {
              background: #fee2e2;
              border-color: #fee2e2;
              color: #ef4444;
            }
            
            .action-button.danger:hover {
              background: #fecaca;
            }
            
            .table-index {
              color: #9ca3af;
              font-size: 0.9rem;
              width: 40px;
            }

            /* Review Modal Styles */
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
            }
            
            .modal-content {
              background: white;
              border-radius: 12px;
              width: 90%;
              max-width: 600px;
              max-height: 90vh;
              overflow-y: auto;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
              padding: 0;
            }
            
            .modal-header {
              padding: 20px 24px;
              border-bottom: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: sticky;
              top: 0;
              background: white;
              z-index: 1;
              border-top-left-radius: 12px;
              border-top-right-radius: 12px;
            }
            
            .modal-title {
              font-size: 1.25rem;
              font-weight: 600;
              color: #1a3251;
              margin: 0;
            }
            
            .modal-close {
              background: none;
              border: none;
              cursor: pointer;
              color: #6b7280;
              padding: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
              transition: all 0.2s;
            }
            
            .modal-close:hover {
              background: #f3f4f6;
              color: #1f2937;
            }
            
            .modal-body {
              padding: 24px;
            }
            
            .review-item {
              margin-bottom: 24px;
            }
            
            .review-label {
              font-size: 0.875rem;
              color: #6b7280;
              margin-bottom: 6px;
              display: block;
            }
            
            .review-value {
              font-size: 1rem;
              color: #1f2937;
              font-weight: 500;
            }
            
            .review-status {
              display: inline-flex;
              align-items: center;
              margin-top: 8px;
            }
            
            .review-actions {
              display: flex;
              justify-content: flex-end;
              gap: 12px;
              margin-top: 24px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            
            @media (max-width: 768px) {
              .titles-filters {
                flex-direction: column;
                align-items: flex-start;
              }
              
              .search-box {
                width: 100%;
              }
              
              .filter-group {
                width: 100%;
                overflow-x: auto;
                padding-bottom: 8px;
              }
            }
          `}
        </style>
        
        <div className="titles-header">
          <div className="header-left">
            <h2>Title Submissions</h2>
            <p>Manage and review all submitted titles</p>
          </div>
          <button className="refresh-button" onClick={fetchTitles}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
            Refresh
          </button>
        </div>
        
        <div className="titles-filters">
          <div className="search-box">
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search titles, authors, or submitted by..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filter-group">
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('approved')}
            >
              Approved
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading title submissions...</p>
          </div>
        ) : filteredTitles.length > 0 ? (
          <table className="titles-table">
            <thead>
              <tr>
                <th className="table-index">#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTitles.map((title, index) => (
                <tr key={title.id}>
                  <td className="table-index">{index + 1}</td>
                  <td>
                    <div className="title-name">{title.title}</div>
                  </td>
                  <td className="title-author">{title.author}</td>
                  <td className="title-date">{formatDate(title.submitted_date)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(title.status)}`}>
                      {title.status.charAt(0).toUpperCase() + title.status.slice(1)}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="action-button primary"
                      onClick={(e) => handleReviewClick(e, title)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
            </div>
            <p className="empty-text">No title submissions found</p>
            <p className="empty-subtext">
              {searchQuery || statusFilter !== 'all' 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "When authors submit titles, they will appear here for review."}
            </p>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedTitle && (
          <div className="modal-overlay" onClick={closeReviewModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Review Title Submission</h3>
                <button className="modal-close" onClick={closeReviewModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="review-item">
                  <span className="review-label">Title</span>
                  <div className="review-value">{selectedTitle.title}</div>
                </div>
                
                <div className="review-item">
                  <span className="review-label">Author</span>
                  <div className="review-value">{selectedTitle.author}</div>
                </div>
                
                
                <div className="review-item">
                  <span className="review-label">Submitted By</span>
                  <div className="review-value">{selectedTitle.submitted_by || selectedTitle.author}</div>
                </div>
                
                <div className="review-item">
                  <span className="review-label">Submission Date</span>
                  <div className="review-value">{formatDate(selectedTitle.submitted_date)}</div>
                </div>
                
                <div className="review-item">
                  <span className="review-label">Status</span>
                  <div className="review-status">
                    <span className={`status-badge ${getStatusBadgeClass(selectedTitle.status)}`}>
                      {selectedTitle.status.charAt(0).toUpperCase() + selectedTitle.status.slice(1)}
                    </span>
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

export default Titles;
