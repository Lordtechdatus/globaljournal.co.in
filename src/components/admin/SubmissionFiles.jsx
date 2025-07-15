import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from './adminLayout';

const SubmissionFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchSubmissionFiles();
  }, []);

  const fetchSubmissionFiles = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch("https://backend.globaljournal.co.in/submission_files_api.php");
      const res = await response.json();

     if (!res.success || !Array.isArray(res.data)) {
     throw new Error("Unexpected response format");
}
setFiles(res.data);

    } catch (error) {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      // Replace with your actual download endpoint
      window.open(`https://backend.globaljournal.co.in/upload/report.php?id=${fileId}`, '_blank');
    } catch (error) {
     
      alert("Failed to download file. Please try again.");
    }
  };

  const handleViewDetails = (submissionId) => {
    navigate(`/admin/submission-details/${submissionId}`);
  };

  const handleStatusChange = async (fileId, newStatus) => {
    try {
      // Replace with your actual status update endpoint
      const response = await fetch("https://backend.globaljournal.co.in/update-file-status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          status: newStatus
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state to reflect the change
        setFiles(files.map(file => 
          file.id === fileId ? { ...file, status: newStatus } : file
        ));
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      alert("Failed to update file status. Please try again.");
    }
  };

  const getFilteredAndSortedFiles = () => {
    return files
      .filter(file => {
        // Apply search filter
        const matchesSearch = 
          file.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Apply status filter
        const matchesStatus = filterStatus === "all" || file.status === filterStatus;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Apply sorting
        let comparison = 0;
        
        switch (sortBy) {
          case "date":
            comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
            break;
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "author":
            comparison = a.author.localeCompare(b.author);
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
          default:
            comparison = 0;
        }
        
        return sortOrder === "asc" ? comparison : -comparison;
      });
  };

  const toggleSortOrder = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "under review":
        return "status-review";
      default:
        return "status-default";
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    
    return sortOrder === "asc" ? (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M8 12l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M8 12l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  const filteredFiles = getFilteredAndSortedFiles();

  return (
    <AdminLayout>
      <div className="submission-files-container">
        <style>
          {`
            .submission-files-container {
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              padding: 28px;
              transition: all 0.3s ease;
            }
            
            .files-header {
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
            
            .filters-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              flex-wrap: wrap;
              gap: 16px;
            }
            
            .search-box {
              position: relative;
              flex: 1;
              min-width: 200px;
              max-width: 400px;
            }
            
            .search-box input {
              width: 100%;
              padding: 10px 16px 10px 40px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              font-size: 0.95rem;
              transition: all 0.2s;
            }
            
            .search-box input:focus {
              outline: none;
              border-color: #3b82f6;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }
            
            .search-icon {
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
              color: #9ca3af;
            }
            
            .filter-controls {
              display: flex;
              gap: 12px;
              flex-wrap: wrap;
            }
            
            .filter-select {
              padding: 10px 16px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: #fff;
              color: #4b5563;
              font-size: 0.95rem;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .filter-select:focus {
              outline: none;
              border-color: #3b82f6;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }
            
            .files-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-top: 10px;
            }
            
            .files-table th {
              text-align: left;
              padding: 16px;
              background: #f9fafb;
              color: #4b5563;
              font-weight: 600;
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 2px solid #e5e7eb;
              cursor: pointer;
              user-select: none;
              white-space: nowrap;
            }
            
            .files-table th:hover {
              background: #f3f4f6;
            }
            
            .files-table td {
              padding: 16px;
              border-bottom: 1px solid #f0f0f0;
              color: #1f2937;
              font-size: 0.95rem;
            }
            
            .files-table tr:last-child td {
              border-bottom: none;
            }
            
            .files-table tr:hover {
              background: rgba(249, 250, 251, 0.5);
            }
            
            .file-title {
              font-weight: 500;
              color: #1a3251;
              max-width: 250px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .file-name {
              color: #6b7280;
              font-size: 0.9rem;
              max-width: 200px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .author-info {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .author-avatar {
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
            
            .author-name {
              font-weight: 500;
            }
            
            .date-cell {
              color: #6b7280;
              white-space: nowrap;
            }
            
            .status-badge {
              display: inline-flex;
              align-items: center;
              padding: 6px 12px;
              border-radius: 9999px;
              font-size: 0.85rem;
              font-weight: 500;
              gap: 6px;
              white-space: nowrap;
            }
            
            .status-pending {
              background: rgba(245, 158, 11, 0.1);
              color: #d97706;
              border: 1px solid rgba(245, 158, 11, 0.2);
            }
            
            .status-approved {
              background: rgba(16, 185, 129, 0.1);
              color: #059669;
              border: 1px solid rgba(16, 185, 129, 0.2);
            }
            
            .status-rejected {
              background: rgba(239, 68, 68, 0.1);
              color: #dc2626;
              border: 1px solid rgba(239, 68, 68, 0.2);
            }
            
            .status-review {
              background: rgba(59, 130, 246, 0.1);
              color: #3b82f6;
              border: 1px solid rgba(59, 130, 246, 0.2);
            }
            
            .status-default {
              background: rgba(107, 114, 128, 0.1);
              color: #6b7280;
              border: 1px solid rgba(107, 114, 128, 0.2);
            }
            
            .status-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              display: inline-block;
            }
            
            .status-pending .status-dot {
              background-color: #d97706;
            }
            
            .status-approved .status-dot {
              background-color: #059669;
            }
            
            .status-rejected .status-dot {
              background-color: #dc2626;
            }
            
            .status-review .status-dot {
              background-color: #3b82f6;
            }
            
            .status-default .status-dot {
              background-color: #6b7280;
            }
            
            .action-buttons {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            }
            
            .action-button {
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 0.85rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
              border: 1px solid transparent;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            
            .download-button {
              background: #f0f9ff;
              color: #0369a1;
              border-color: #e0f2fe;
            }
            
            .download-button:hover {
              background: #e0f2fe;
            }
            
            .view-button {
              background: #f5f3ff;
              color: #6d28d9;
              border-color: #ede9fe;
            }
            
            .view-button:hover {
              background: #ede9fe;
            }
            
            .status-dropdown {
              padding: 6px 12px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
              background: #fff;
              color: #4b5563;
              font-size: 0.85rem;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .status-dropdown:focus {
              outline: none;
              border-color: #3b82f6;
            }
            
            .empty-state {
              text-align: center;
              padding: 60px 20px;
              color: #6b7280;
            }
            
            .empty-state svg {
              margin-bottom: 16px;
            }
            
            .empty-state h3 {
              font-size: 1.2rem;
              font-weight: 500;
              margin-bottom: 8px;
              color: #1f2937;
            }
            
            .empty-state p {
              max-width: 400px;
              margin: 0 auto;
            }
            
            .loading-spinner {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 40px;
            }
            
            .spinner {
              border: 3px solid rgba(0, 0, 0, 0.1);
              border-radius: 50%;
              border-top: 3px solid #3b82f6;
              width: 24px;
              height: 24px;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @media (max-width: 1024px) {
              .files-table {
                display: block;
                overflow-x: auto;
              }
            }
            
            @media (max-width: 640px) {
              .filters-row {
                flex-direction: column;
                align-items: stretch;
              }
              
              .search-box {
                max-width: none;
              }
            }
          `}
        </style>
        
        <div className="files-header">
          <div className="header-left">
            <h2>Submission Files</h2>
            <p>Manage and review all submitted files</p>
          </div>
          <button className="refresh-button" onClick={fetchSubmissionFiles}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 018-8V1l9 7-9 7v-3a6 6 0 100 12h2" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>
        
        <div className="filters-row">
          <div className="search-box">
            <div className="search-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search files, authors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="under review">Under Review</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="files-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSortOrder("title")}>
                    File Information {renderSortIcon("title")}
                  </th>
                  <th onClick={() => toggleSortOrder("author")}>
                    Author {renderSortIcon("author")}
                  </th>
                  <th onClick={() => toggleSortOrder("date")}>
                    Uploaded {renderSortIcon("date")}
                  </th>
                  <th onClick={() => toggleSortOrder("status")}>
                    Status {renderSortIcon("status")}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <div className="file-title">{file.title}</div>
                      <div className="file-name">{file.fileName}</div>
                    </td>
                    <td>
                      <div className="author-info">
                      <div className="author-avatar">
                  {file.author ? file.author.charAt(0).toUpperCase() : 'U'}
                  </div>
                    <span className="author-name">{file.author|| 'Not Assigned'}</span>

                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(file.uploadDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className={`status-badge ${getStatusBadgeClass(file.status)}`}>
                        <span className="status-dot"></span>
                        {file.status || "Unknown"}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <select 
                          className="status-dropdown"
                          value={file.status || ""}
                          onChange={(e) => handleStatusChange(file.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="under review">Under Review</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" 
                stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" 
                stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No files found</h3>
            <p>There are no submission files matching your search criteria. Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SubmissionFiles;
