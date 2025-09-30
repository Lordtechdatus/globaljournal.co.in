import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import AdminLayout from "./adminLayout";

const dashboardStyles = `
/* Dashboard Grid Layout */
.dashboard-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* Modern Dashboard Cards */
.dashboard-card {
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color, #667eea);
  border-radius: 20px 20px 0 0;
}

.dashboard-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 2.8rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1;
}

.card-change {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.card-change.positive {
  color: #059669;
  background: #d1fae5;
}

.card-change.negative {
  color: #dc2626;
  background: #fee2e2;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-color, #667eea);
  flex-shrink: 0;
}

.card-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

/* Content Sections */
.dashboard-content {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.content-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.content-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 4px;
}

/* Activity List */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.activity-item:hover {
  background: #f1f5f9;
  border-left-color: #667eea;
  transform: translateX(4px);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 0.8rem;
  color: #64748b;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: #94a3b8;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 0.95rem;
  color: #64748b;
  max-width: 400px;
  margin: 0 auto;
}

/* Loading States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-left: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-overview {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .dashboard-card {
    padding: 24px;
  }
  
  .card-value {
    font-size: 2.2rem;
  }
  
  .dashboard-content {
    padding: 24px;
  }
  
  .activity-item {
    padding: 12px;
  }
}

/* Color Variants */
.card-users { --card-color: #667eea; }
.card-reports { --card-color: #f093fb; }
.card-files { --card-color: #4facfe; }
.card-titles { --card-color: #43e97b; }
.card-contributors { --card-color: #fa709a; }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    users: 0,
    titles: 0,
    new_submissions: 0,
    reports: 0,
    submission_files: 0,
    contributors: 0,
  });
  
  useEffect(() => {
    axios.get("https://backend.globaljournal.co.in/dashboard-stats.php")
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to load stats", err));
  }, []);
  
  const [activity, setActivity] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));

  useEffect(() => {
    axios.get("https://backend.globaljournal.co.in/recent-activity.php")
      .then(res => setActivity(res.data))
      .catch(err => console.error("Failed to load recent activity", err));
  }, []);

  const filteredActivity = useMemo(() => {
    if (!Array.isArray(activity)) return [];
    return activity.filter(item => {
      if (!item || !item.created_at) return false;
      const date = new Date(item.created_at);
      if (Number.isNaN(date.getTime())) return false;
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return yearMonth === selectedMonth;
    });
  }, [activity, selectedMonth]);

  const cardData = [
    {
      title: 'Total Users',
      value: stats.users,
      className: 'card-users',
      onClick: () => navigate('/admin/users'),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      change: '+12%'
    },
    {
      title: 'Reports',
      value: stats.reports,
      className: 'card-reports',
      onClick: () => navigate('/admin/reports'),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      change: '+5%'
    },
    {
      title: 'Submission Files',
      value: stats.submission_files,
      className: 'card-files',
      onClick: () => navigate('/admin/submission-files'),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      change: '+18%'
    },
    {
      title: 'Titles',
      value: stats.titles,
      className: 'card-titles',
      onClick: () => navigate('/admin/titles'),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      change: '+3%'
    },
    {
      title: 'Contributors',
      value: stats.contributors,
      className: 'card-contributors',
      onClick: () => navigate('/admin/new-submissions'),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      change: '+25%'
    }
  ];

  return (
    <AdminLayout>
      <style>{dashboardStyles}</style>
      
      <section className="dashboard-overview">
        {cardData.map((card, index) => (
          <div 
            key={index} 
            className={`dashboard-card ${card.className}`} 
            onClick={card.onClick}
          >
            <div className="card-header">
              <div className="card-info">
                <div className="card-title">{card.title}</div>
                <div className="card-value">{card.value.toLocaleString()}</div>
                <div className="card-change positive">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {card.change}
                </div>
              </div>
              <div className="card-icon">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </section>
      
      <section className="dashboard-content">
        <div className="content-header">
          <div>
            <h2 className="content-title">Recent Activity</h2>
            <div className="content-subtitle">Latest updates and changes in your system</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.9rem'
              }}
            />
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {filteredActivity.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="empty-title">No Activity for Selected Month</div>
            <div className="empty-description">
              Choose another month to view activity, or refresh to fetch latest updates.
            </div>
          </div>
        ) : (
          <ul className="activity-list">
            {filteredActivity.map((item, idx) => (
              <li key={idx} className="activity-item">
                <div 
                  className="activity-icon"
                  style={{
                    background: item.type === 'user' ? '#667eea' :
                               item.type === 'submission' ? '#43e97b' : '#64748b'
                  }}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white">
                    {item.type === 'user' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    ) : item.type === 'submission' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{item.message}</div>
                  <div className="activity-time">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminLayout>
  );
};

export default Dashboard;
