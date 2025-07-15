import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import AdminLayout from "./adminLayout";

const dashboardStyles = `
.dashboard-cards {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.dashboard-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(35,41,70,0.10);
  padding: 32px 36px;
  min-width: 220px;
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.18s, box-shadow 0.18s;
  cursor: pointer;
  border-left: 6px solid #eebbc3;
}
.dashboard-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 6px 24px rgba(35,41,70,0.16);
}
.card-title {
  font-size: 1.1rem;
  color: #6e6e6e;
  margin-bottom: 8px;
}
.card-value {
  font-size: 2.3rem;
  font-weight: bold;
  color: #232946;
  margin-bottom: 6px;
}
.card-status {
  font-size: 0.95rem;
  color: #e63946;
  background: #ffe5e9;
  border-radius: 6px;
  padding: 2px 10px;
  margin-top: 4px;
}
.dashboard-content {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(35,41,70,0.07);
  padding: 32px 36px;
  margin-bottom: 32px;
}
.dashboard-content h2 {
  margin-top: 0;
  font-size: 1.3rem;
  color: #232946;
}
.activity-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
}
.activity-list li {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #232946;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.activity-list li:last-child {
  border-bottom: none;
}
@media (max-width: 1100px) {
  .dashboard-cards {
    flex-direction: column;
    gap: 16px;
  }
}
@media (max-width: 700px) {
  .dashboard-cards {
    gap: 10px;
  }
}`;

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

  useEffect(() => {
    axios.get("https://backend.globaljournal.co.in/recent-activity.php")
      .then(res => setActivity(res.data))
      .catch(err => console.error("Failed to load recent activity", err));
  }, []);

  return (
    <AdminLayout>
      <style>{dashboardStyles}</style>
      <section className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate('/admin/users')}>
          <div className="card-title">Users</div>
          <div className="card-value" style={{ color: '#3a86ff' }}>{stats.users}</div>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/admin/reports')}>
          <div className="card-title">Reports</div>
          <div className="card-value" style={{ color: '#43aa8b' }}>{stats.reports}</div>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/admin/submission-files')}>
          <div className="card-title">Submission files</div>
          <div className="card-value" style={{ color: '#f72585' }}>{stats.submission_files}</div>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/admin/titles')}>
          <div className="card-title">Title</div>
          <div className="card-value" style={{ color: '#f72585' }}>{stats.titles}</div>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/admin/new-submissions')}>
          <div className="card-title">Contributors</div>
          <div className="card-value" style={{ color: '#118ab2' }}>{stats.contributors}</div>
        </div>
      </section>
      
      <section className="dashboard-content">
        <h2>Recent Activity</h2>
        <ul className="activity-list">
          {activity.length === 0 ? (
            <li>No recent activity</li>
          ) : (
            activity.map((item, idx) => (
              <li key={idx}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke={
                    item.type === 'user' ? '#3a86ff' :
                    item.type === 'submission' ? '#43aa8b' : '#888'
                  } strokeWidth="2"/>
                  <path d={
                    item.type === 'user' || item.type === 'submission' ?
                    "M8 12l2.5 2.5L16 9" : "M12 8v4l3 3"
                  } stroke={
                    item.type === 'user' ? '#3a86ff' :
                    item.type === 'submission' ? '#43aa8b' : '#888'
                  } strokeWidth="2"/>
                </svg>
                {item.message}
              </li>
            ))
          )}
        </ul>
      </section>
    </AdminLayout>
  );
};

export default Dashboard;
