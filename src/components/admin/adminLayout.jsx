// components/admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = localStorage.getItem("adminName") || "Admin";

  const sidebarLinks = [
    { 
      label: "Dashboard", 
      link: "/dashboard", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="9" rx="1" stroke="#b8c1ec" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="5" rx="1" stroke="#b8c1ec" strokeWidth="2"/>
          <rect x="14" y="12" width="7" height="9" rx="1" stroke="#b8c1ec" strokeWidth="2"/>
          <rect x="3" y="16" width="7" height="5" rx="1" stroke="#b8c1ec" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      label: "My Profile", 
      link: "/admin/profile", 
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" stroke="#b8c1ec" strokeWidth="2"/>
          <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#b8c1ec" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      label: "Users", 
      link: "/admin/users", 
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" stroke="#b8c1ec" strokeWidth="2"/>
          <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#b8c1ec" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      label: "New submissions", 
      link: "/admin/new-submissions", 
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#b8c1ec" strokeWidth="2"/>
          <path d="M3 7h18" stroke="#b8c1ec" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      label: "Reports", 
      link: "/admin/reports", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="9" rx="1" stroke="#b8c1ec" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="5" rx="1" stroke="#b8c1ec" strokeWidth="2"/>
          <rect x="14" y="12" width="7" height="9" rx="1" stroke="#b8c1ec" strokeWidth="2"/>
          <rect x="3" y="16" width="7" height="5" rx="1" stroke="#b8c1ec" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      label: "Submission files", 
      link: "/admin/submission-files", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#b8c1ec" strokeWidth="2"/>
          <path d="M14 2v6h6" stroke="#b8c1ec" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      label: "Titles", 
      link: "/admin/titles", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z" fill="#b8c1ec"/>
        </svg>
      )
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminUser");
    navigate("/adminlogin", { replace: true });
  };

  // Check if the current path matches the link or if it's the Users link (to match the image)
  const isActive = (path, label) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };
  

  return (
    <>
      <style>
        {`
          body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
          .dashboard-container {
            display: flex; min-height: 100vh;
          }
          .dashboard-sidebar {
            width: 260px; background: #232946; color: #fff; display: flex; flex-direction: column; 
            padding: 0; box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          }
          .sidebar-header {
            padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          .sidebar-logo {
            font-size: 1.5rem; color: #eebbc3; font-weight: bold;
          }
          .admin-info {
            margin-top: 8px; font-size: 0.9rem; color: #b8c1ec;
          }
          .sidebar-nav {
            padding: 16px 0;
          }
          .nav-link {
            display: flex; align-items: center; padding: 12px 24px; color: #b8c1ec; 
            text-decoration: none; transition: all 0.2s;
          }
          .nav-link.active {
            background: rgba(238, 187, 195, 0.2); color: #fff; border-left: 4px solid #eebbc3;
          }
          .nav-link:hover:not(.active) {
            background: rgba(184, 193, 236, 0.1);
          }
          .nav-icon {
            margin-right: 12px; width: 20px; text-align: center; display: flex; align-items: center; justify-content: center;
          }
          .logout-btn {
            margin-top: auto; padding: 16px 24px; background: rgba(255,255,255,0.1); 
            color: #eebbc3; cursor: pointer; text-align: center; transition: all 0.2s;
            display: flex; align-items: center; justify-content: center;
          }
          .logout-btn:hover {
            background: rgba(255,255,255,0.2);
          }
          .dashboard-main {
            flex: 1; overflow-y: auto; background: #f5f5f7; padding: 0;
          }
          .main-header {
            background: #fff; padding: 16px 32px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            display: flex; justify-content: space-between; align-items: center;
          }
          .page-title {
            font-size: 1.5rem; font-weight: 500; color: #232946;
          }
          .main-content {
            padding: 32px;
          }
          
          /* Yellow highlight for active item */
          .nav-link.active {
            background: rgba(255, 215, 0, 0.2);
            color: #FFFF00;
            border-left: 4px solid #FFFF00;
          }
          
          @media (max-width: 768px) {
            .dashboard-sidebar {
              width: 220px;
            }
            .main-content {
              padding: 20px;
            }
          }
        `}
      </style>
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">GJCME Admin</div>
            <div className="admin-info">Welcome, {adminName}</div>
          </div>
          <nav className="sidebar-nav">
            {sidebarLinks.map((link, idx) => (
              <a
                key={idx}
                className={`nav-link ${isActive(link.link, link.label) ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (link.link && link.link !== "#") navigate(link.link);
                }}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M16 17l5-5-5-5M21 12H9" stroke="#eebbc3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#eebbc3" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ marginLeft: '12px' }}>Logout</span>
          </div>
        </aside>
        <main className="dashboard-main">
          <div className="main-header">
            <h1 className="page-title">
              {sidebarLinks.find(link => isActive(link.link, link.label))?.label || "Dashboard"}
            </h1>
          </div>
          <div className="main-content">{children}</div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
