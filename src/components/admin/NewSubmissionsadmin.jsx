import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from './adminLayout';

const NewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://backend.globaljournal.co.in/get-newsubmission-admin.php");
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        throw new Error("Unexpected response");
      }
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AdminLayout>
      <div className="new-submissions-container">
        <style>
          {`
            .new-submissions-container {
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              padding: 28px;
              margin: 20px;
              transition: all 0.3s ease;
            }
            
            .submissions-header {
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
            
            .submissions-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-top: 10px;
            }
            
            .submissions-table th {
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
            
            .submissions-table td {
              padding: 16px;
              border-bottom: 1px solid #f0f0f0;
              color: #1f2937;
              font-size: 0.95rem;
            }
            
            .submissions-table tr:last-child td {
              border-bottom: none;
            }
            
            .submissions-table tr:hover {
              background: rgba(249, 250, 251, 0.5);
            }
            
            .submission-title {
              font-weight: 500;
              color: #1a3251;
              max-width: 300px;
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
            }
            
            .status-badge {
              display: inline-flex;
              align-items: center;
              padding: 6px 12px;
              border-radius: 9999px;
              font-size: 0.85rem;
              font-weight: 500;
              gap: 6px;
            }
            
            .status-pending {
              background: rgba(245, 158, 11, 0.1);
              color: #d97706;
              border: 1px solid rgba(245, 158, 11, 0.2);
            }
            
            .status-review {
              background: rgba(59, 130, 246, 0.1);
              color: #3b82f6;
              border: 1px solid rgba(59, 130, 246, 0.2);
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
            
            .status-review .status-dot {
              background-color: #3b82f6;
            }
            
            .action-buttons {
              display: flex;
              gap: 8px;
            }
            
            .action-buttons button {
              padding: 8px 16px;
              border-radius: 6px;
              border: none;
              cursor: pointer;
              font-size: 0.9rem;
              font-weight: 500;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            
            .view-btn {
              background: #1a3251;
              color: #fff;
            }
            
            .view-btn:hover {
              background: #0f2a47;
              transform: translateY(-1px);
            }
            
            .assign-btn {
              background: #fff;
              color: #1a3251;
              border: 1px solid #1a3251;
            }
            
            .assign-btn:hover {
              background: #f9fafb;
              transform: translateY(-1px);
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
        
        <div className="submissions-header">
          <div className="header-left">
            <h2>New Submissions</h2>
            <p>Review and manage recently submitted papers</p>
          </div>
          <button className="refresh-button" onClick={fetchSubmissions}>
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
            <div>Loading submissions...</div>
          </div>
        ) : submissions.length > 0 ? (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Submission Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    <div className="submission-title">{submission.title}</div>
                  </td>
                  <td>
                    <div className="author-info">
                      <div className="author-avatar">
                        {submission.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="author-name">{submission.author}</span>
                    </div>
                  </td>
                  <td className="date-cell">{submission.submissionDate}</td>
                  <td>
                    <span className={`status-badge ${
                      submission.status === "Pending Review" 
                        ? "status-pending" 
                        : "status-review"
                    }`}>
                      <span className="status-dot"></span>
                      {submission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                <path d="M8.5 8.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708L9 10.293V8.5z"/>
              </svg>
            </div>
            <div className="empty-text">No new submissions found</div>
            <div className="empty-subtext">When authors submit new papers, they will appear here for review and assignment.</div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewSubmissions;