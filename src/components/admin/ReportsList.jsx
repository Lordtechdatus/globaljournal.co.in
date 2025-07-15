import React, { useState, useEffect } from "react";
import AdminLayout from './adminLayout';
import axios from 'axios';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [downloadingMap, setDownloadingMap] = useState({});
  
 
  useEffect(() => {
   
    axios.get("https://backend.globaljournal.co.in/get-reports.php")
      .then(response => {   
        const processedReports = response.data.map(report => ({
          ...report,
          title: report.title || 'Untitled',
          author: report.author || 'Unknown',
          type: report.type || 'Unknown',
          status: report.status || 'Unknown',
          views: report.views || 0,
          downloads: report.downloads || 0
        }));
        setReports(processedReports);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });

  }, []);

  const viewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
  };

  const downloadReport = (report) => {
    setDownloadingMap(prevState => ({
      ...prevState,
      [report.id]: true
    }));
    
    axios({
      url: `https://backend.globaljournal.co.in/download-report.php?id=${report.id}`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report.docx');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        axios.post("https://backend.globaljournal.co.in/download-report.php", { reportId: report.id })
          .then(() => {
            const updatedReports = reports.map(r => {
              if (r.id === report.id) {
                return { ...r, downloads: (r.downloads || 0) + 1 };
              }
              return r;
            });
            setReports(updatedReports);
          })
          .catch(error => {
          });
          
        setDownloadingMap(prevState => ({
          ...prevState,
          [report.id]: false
        }));
      })
      .catch((error) => {
        alert("Failed to download report. Please try again later.");
        setDownloadingMap(prevState => ({
          ...prevState,
          [report.id]: false
        }));
      });
  };

  const sortedReports = [...reports].sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });


  const filteredReports = sortedReports.filter(report => {
    const reportType = (report.type || '').toLowerCase();
    const reportStatus = (report.status || '').toLowerCase();
    const filterValue = filter.toLowerCase();
    
    const matchesFilter = filter === 'all' || 
                          reportType === filterValue || 
                          reportStatus === filterValue;
    
    const reportTitle = (report.title || '').toLowerCase();
    const reportAuthor = (report.author || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = !searchTerm || 
                          reportTitle.includes(searchTermLower) || 
                          reportAuthor.includes(searchTermLower);
    
    const matchesDateRange = !dateRange.start || !dateRange.end || 
                            (report.date >= dateRange.start && report.date <= dateRange.end);
    
    return matchesFilter && matchesSearch && matchesDateRange;
  });


  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  const getStatusBadgeClass = (status) => {
    if (!status) return '';
    
    switch(status.toLowerCase()) {
      case 'published': return 'status-published';
      default: return '';
    }
  };

  return (
    <AdminLayout>
      <div className="reports-container">
        <style>
          {`
            .reports-container {
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              padding: 28px;
              margin: 20px;
              transition: all 0.3s ease;
            }
            
            .reports-header {
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
            
            .reports-filters {
              display: flex;
              flex-wrap: wrap;
              gap: 16px;
              margin-bottom: 24px;
              align-items: center;
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
            
            .filter-btn:hover:not(.active) {
              background: #f3f4f6;
              border-color: #d1d5db;
            }
            
            .search-box {
              flex-grow: 1;
              position: relative;
            }
            
            .search-box input {
              width: 100%;
              padding: 10px 16px 10px 40px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
              font-size: 0.95rem;
              transition: all 0.2s;
            }
            
            .search-box input:focus {
              outline: none;
              border-color: #1a3251;
              box-shadow: 0 0 0 2px rgba(26, 50, 81, 0.1);
            }
            
            .search-icon {
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
              color: #9ca3af;
            }
            
            .date-filters {
              display: flex;
              gap: 8px;
              align-items: center;
            }
            
            .date-filters input {
              padding: 8px 12px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
              font-size: 0.9rem;
            }
            
            .date-filters input:focus {
              outline: none;
              border-color: #1a3251;
            }
            
            .reports-stats {
              display: flex;
              gap: 24px;
              margin-bottom: 32px;
              flex-wrap: wrap;
            }
            
            .stat-card {
              background: #f9fafb;
              border-radius: 10px;
              padding: 20px;
              flex: 1;
              min-width: 180px;
              border-left: 4px solid #1a3251;
              transition: all 0.2s;
            }
            
            .stat-card:hover {
              transform: translateY(-3px);
              box-shadow: 0 6px 16px rgba(0,0,0,0.1);
            }
            
            .stat-card.published {
              border-left-color: #10b981;
            }
            
            .stat-card.draft {
              border-left-color: #f59e0b;
            }
            
            .stat-card.review {
              border-left-color: #3b82f6;
            }
            
            .stat-title {
              color: #6b7280;
              font-size: 0.9rem;
              margin-bottom: 8px;
            }
            
            .stat-value {
              color: #1a3251;
              font-size: 1.8rem;
              font-weight: 600;
            }
            
            .reports-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-top: 10px;
            }
            
            .reports-table th {
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
              transition: all 0.2s;
            }
            
            .reports-table th:hover {
              background: #f3f4f6;
            }
            
            .reports-table td {
              padding: 16px;
              border-bottom: 1px solid #f0f0f0;
              color: #1f2937;
              font-size: 0.95rem;
            }
            
            .reports-table tr:last-child td {
              border-bottom: none;
            }
            
            .reports-table tr:hover {
              background: rgba(249, 250, 251, 0.5);
            }
            
            .report-title {
              font-weight: 500;
              color: #1a3251;
              max-width: 300px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
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
            
            .status-published {
              background: rgba(16, 185, 129, 0.1);
              color: #10b981;
              border: 1px solid rgba(16, 185, 129, 0.2);
            }
            
            .status-draft {
              background: rgba(245, 158, 11, 0.1);
              color: #f59e0b;
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
            
            .status-published .status-dot {
              background-color: #10b981;
            }
            
            .status-draft .status-dot {
              background-color: #f59e0b;
            }
            
            .status-review .status-dot {
              background-color: #3b82f6;
            }
            
            .action-buttons {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
              justify-content: flex-start;
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
            
            .download-btn {
              background: #fff;
              color: #1a3251;
              border: 1px solid #1a3251;
              white-space: nowrap;
              min-width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .download-btn:hover {
              background: #f9fafb;
              transform: translateY(-1px);
            }
            
            .download-btn:disabled, .report-modal-btn:disabled {
              opacity: 0.7;
              cursor: not-allowed;
            }
            
            .spinner {
              display: inline-block;
              width: 16px;
              height: 16px;
              border: 2px solid rgba(255,255,255,.3);
              border-radius: 50%;
              border-top-color: #fff;
              animation: spin 1s ease-in-out infinite;
              margin-right: 8px;
            }
            
            @keyframes spin {
              to { transform: rotate(360deg); }
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
            }
            
            .empty-state h3 {
              margin-top: 16px;
              color: #1f2937;
              font-size: 1.2rem;
            }
            
            .empty-state p {
              margin-top: 8px;
              max-width: 400px;
              margin-left: auto;
              margin-right: auto;
            }
            
            .create-report-btn {
              margin-top: 16px;
              padding: 10px 20px;
              background: #1a3251;
              color: #fff;
              border: none;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .create-report-btn:hover {
              background: #0f2a47;
              transform: translateY(-1px);
            }
            
            @media (max-width: 768px) {
              .reports-filters {
                flex-direction: column;
                align-items: stretch;
              }
              
              .search-box {
                order: -1;
              }
              
              .reports-stats {
                flex-direction: column;
              }
              
              .date-filters {
                flex-direction: column;
                align-items: stretch;
              }
              
              .action-buttons {
                flex-direction: column;
                width: 100%;
              }
              
              .download-btn, .view-btn {
                width: 100%;
                justify-content: center;
              }
            }
            
            /* Modal styles */
            .report-modal-overlay {
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
            
            .report-modal {
              background: white;
              border-radius: 12px;
              width: 80%;
              max-width: 800px;
              max-height: 90vh;
              overflow-y: auto;
              padding: 24px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .report-modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              padding-bottom: 16px;
              border-bottom: 1px solid #f0f0f0;
            }
            
            .report-modal-title {
              font-size: 1.5rem;
              font-weight: 600;
              color: #1a3251;
            }
            
            .close-modal-btn {
              background: none;
              border: none;
              font-size: 1.5rem;
              cursor: pointer;
              color: #6b7280;
              transition: color 0.2s;
            }
            
            .close-modal-btn:hover {
              color: #1a3251;
            }
            
            .report-modal-content {
              margin-bottom: 24px;
            }
            
            .report-detail-row {
              display: flex;
              margin-bottom: 16px;
              border-bottom: 1px solid #f9fafb;
              padding-bottom: 16px;
            }
            
            .report-detail-label {
              width: 140px;
              font-weight: 500;
              color: #4b5563;
            }
            
            .report-detail-value {
              flex: 1;
              color: #1f2937;
            }
            
            .report-modal-actions {
              display: flex;
              justify-content: flex-end;
              gap: 12px;
              margin-top: 24px;
            }
            
            .report-modal-btn {
              padding: 10px 20px;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .primary-btn {
              background: #1a3251;
              color: white;
              border: none;
            }
            
            .primary-btn:hover {
              background: #0f2a47;
            }
            
            .secondary-btn {
              background: white;
              color: #1a3251;
              border: 1px solid #1a3251;
            }
            
            .secondary-btn:hover {
              background: #f9fafb;
            }
            
            /* End of modal styles */
          `}
        </style>


        <div className="reports-stats">
          <div className="stat-card published">
            <div className="stat-title">Published Reports</div>
            <div className="stat-value">{reports.filter(r => (r.status || '').toLowerCase() === 'published').length}</div>
          </div>
          <div className="stat-card draft">
            <div className="stat-title">Draft Reports</div>
            <div className="stat-value">{reports.filter(r => (r.status || '').toLowerCase() === 'draft').length}</div>
          </div>
          <div className="stat-card review">
            <div className="stat-title">In Review</div>
            <div className="stat-value">{reports.filter(r => (r.status || '').toLowerCase() === 'review').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Downloads</div>
            <div className="stat-value">{Number(reports.reduce((sum, report) => sum + (report.downloads || 0),0))}</div>
          </div>
        </div>

        <div className="reports-filters">
          <div className="filter-group">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'financial' ? 'active' : ''}`}
              onClick={() => setFilter('financial')}
            >
              Financial
            </button>
            <button 
              className={`filter-btn ${filter === 'research' ? 'active' : ''}`}
              onClick={() => setFilter('research')}
            >
              Research
            </button>
            <button 
              className={`filter-btn ${filter === 'metrics' ? 'active' : ''}`}
              onClick={() => setFilter('metrics')}
            >
              Metrics
            </button>
            <button 
              className={`filter-btn ${filter === 'review' ? 'active' : ''}`}
              onClick={() => setFilter('review')}
            >
              Review
            </button>
          </div>
          <div className="search-box">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="date-filters">
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              placeholder="Start date"
            />
            <span>to</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              placeholder="End date"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 17h6M12 12v5M12 3v1M3 12h1M20 12h1M5.6 5.6l.7.7M18.4 5.6l-.7.7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="2" />
            </svg>
            <h3>No reports found</h3>
            <p>Try adjusting your filters or create a new report</p>
          </div>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('title')}>
                  Report Title
                  {sortConfig.key === 'title' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('type')}>
                  Type
                  {sortConfig.key === 'type' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('author')}>
                  Author
                  {sortConfig.key === 'author' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('date')}>
                  Date
                  {sortConfig.key === 'date' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('status')}>
                  Status
                  {sortConfig.key === 'status' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="report-title">{report.title || 'Untitled'}</div>
                  </td>
                  <td>
                    <span style={{ textTransform: 'capitalize' }}>{report.type || 'Unknown'}</span>
                  </td>
                  <td>{report.author || 'Unknown'}</td>
                  <td>{report.date ? new Date(report.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'Unknown date'}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(report.status)}`}>
                      <span className="status-dot"></span>
                      <span style={{ textTransform: 'capitalize' }}>{report.status || 'Unknown'}</span>
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn" onClick={() => viewReport(report)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M2 12s3-9 10-9 10 9 10 9-3 9-10 9-10-9-10-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        View
                      </button>
                      {report.status === 'published' && (
                        <button 
                          className="download-btn" 
                          onClick={() => downloadReport(report)}
                          disabled={downloadingMap[report.id]}
                        >
                          {downloadingMap[report.id] ? (
                            <>
                              <span className="spinner"></span>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 4v12m0 0l5-5m-5 5l-5-5m10 9H7a2 2 0 01-2-2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Download
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Report Detail Modal */}
        {showReportModal && selectedReport && (
          <div className="report-modal-overlay">
            <div className="report-modal">
              <div className="report-modal-header">
                <h3 className="report-modal-title">Report Details</h3>
                <button className="close-modal-btn" onClick={closeReportModal}>×</button>
              </div>
              <div className="report-modal-content">
                <div className="report-detail-row">
                  <div className="report-detail-label">Title</div>
                  <div className="report-detail-value">{selectedReport.title || 'Untitled'}</div>
                </div>
                <div className="report-detail-row">
                  <div className="report-detail-label">Type</div>
                  <div className="report-detail-value" style={{ textTransform: 'capitalize' }}>{selectedReport.type || 'Unknown'}</div>
                </div>
                <div className="report-detail-row">
                  <div className="report-detail-label">Author</div>
                  <div className="report-detail-value">{selectedReport.author || 'Unknown'}</div>
                </div>
                <div className="report-detail-row">
                  <div className="report-detail-label">Date</div>
                  <div className="report-detail-value">
                    {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Unknown date'}
                  </div>
                </div>
                <div className="report-detail-row">
                  <div className="report-detail-label">Status</div>
                  <div className="report-detail-value">
                    <span className={`status-badge ${getStatusBadgeClass(selectedReport.status)}`}>
                      <span className="status-dot"></span>
                      <span style={{ textTransform: 'capitalize' }}>{selectedReport.status || 'Unknown'}</span>
                    </span>
                  </div>
                </div>
                <div className="report-detail-row">
                  <div className="report-detail-label">Description</div>
                  <div className="report-detail-value">{selectedReport.description || "No description available"}</div>
                </div>
              </div>
              <div className="report-modal-actions">
                {selectedReport.status === 'published' && (
                  <button 
                    className="report-modal-btn secondary-btn" 
                    onClick={() => downloadReport(selectedReport)}
                    disabled={downloadingMap[selectedReport.id]}
                  >
                    {downloadingMap[selectedReport.id] ? (
                      <>
                        <span className="spinner"></span>
                        Downloading...
                      </>
                    ) : (
                      'Download Report'
                    )}
                  </button>
                )}
                <button className="report-modal-btn primary-btn" onClick={closeReportModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportsList;