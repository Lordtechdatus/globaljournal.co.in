// components/admin/AdminLayout.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const adminName = localStorage.getItem("adminName") || "Admin";

  const sidebarLinks = [
    { 
      label: "Dashboard", 
      link: "/dashboard", 
      icon: "dashboard",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="1"/>
          <rect x="14" y="3" width="7" height="5" rx="1"/>
          <rect x="14" y="12" width="7" height="9" rx="1"/>
          <rect x="3" y="16" width="7" height="5" rx="1"/>
        </svg>
      )
    },
    { 
      label: "My Profile", 
      link: "/admin/profile", 
      icon: "profile",
      iconSvg: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      )
    },
    { 
      label: "Users", 
      link: "/admin/users", 
      icon: "users",
      iconSvg: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      )
    },
    { 
      label: "New Submissions", 
      link: "/admin/new-submissions", 
      icon: "submissions",
      iconSvg: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      )
    },
    { 
      label: "Reports", 
      link: "/admin/reports", 
      icon: "reports",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 17H7A5 5 0 0 1 7 7h2m0 10a5 5 0 0 1 5-5h2a5 5 0 0 1 0 10h-2m-5-5a5 5 0 0 1 5-5 5 5 0 0 1 5 5m-5 0v6"/>
        </svg>
      )
    },
    { 
      label: "Submission Files", 
      link: "/admin/submission-files", 
      icon: "files",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
          <path d="M13 2v7h7"/>
        </svg>
      )
    },
    { 
      label: "Titles", 
      link: "/admin/titles", 
      icon: "titles",
      iconSvg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16"/>
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
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f8fafc;
          }
          
          /* Main Layout */
          .dashboard-container {
            display: flex; 
            min-height: 100vh;
            background: #f8fafc;
          }
          
          /* Sidebar Styles */
          .dashboard-sidebar {
            width: ${sidebarCollapsed ? '80px' : '280px'}; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff; 
            display: flex; 
            flex-direction: column; 
            padding: 0; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: width 0.3s ease;
            position: relative;
            z-index: 100;
          }
          
          .sidebar-toggle {
            position: absolute;
            top: 20px;
            right: -12px;
            background: #fff;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 101;
            transition: transform 0.2s;
          }
          
          .sidebar-toggle:hover {
            transform: scale(1.1);
          }
          
          .sidebar-toggle svg {
            width: 14px;
            height: 14px;
            color: #667eea;
            transition: transform 0.3s;
            transform: rotate(${sidebarCollapsed ? '180deg' : '0deg'});
          }
          
          .sidebar-header {
            padding: 32px 24px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            text-align: ${sidebarCollapsed ? 'center' : 'left'};
          }
          
          .sidebar-logo {
            font-size: ${sidebarCollapsed ? '1.2rem' : '1.6rem'}; 
            color: #fff; 
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: ${sidebarCollapsed ? '0' : '8px'};
          }
          
          .admin-info {
            margin-top: 8px; 
            font-size: 0.9rem; 
            color: rgba(255,255,255,0.8);
            display: ${sidebarCollapsed ? 'none' : 'block'};
            font-weight: 500;
          }
          
          .sidebar-nav {
            padding: 24px 0;
            flex: 1;
          }
          
          .nav-link {
            display: flex; 
            align-items: center; 
            padding: ${sidebarCollapsed ? '16px 24px' : '14px 24px'}; 
            color: rgba(255,255,255,0.9); 
            text-decoration: none; 
            transition: all 0.3s ease;
            position: relative;
            margin: 4px 12px;
            border-radius: 12px;
            font-weight: 500;
            font-size: 0.95rem;
            border: none;
            background: transparent;
            cursor: pointer;
            width: calc(100% - 24px);
            text-align: left;
          }
          
          .nav-link:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #fff;
            border-radius: 0 4px 4px 0;
            transform: scaleY(0);
            transition: transform 0.3s ease;
          }
          
          .nav-link.active {
            background: rgba(255,255,255,0.15);
            color: #fff;
            backdrop-filter: blur(10px);
          }
          
          .nav-link.active:before {
            transform: scaleY(1);
          }
          
          .nav-link:hover:not(.active) {
            background: rgba(255,255,255,0.1);
            transform: translateX(4px);
          }
          
          .nav-icon {
            margin-right: ${sidebarCollapsed ? '0' : '16px'}; 
            width: 22px; 
            height: 22px;
            display: flex; 
            align-items: center; 
            justify-content: center;
            flex-shrink: 0;
          }
          
          .nav-label {
            display: ${sidebarCollapsed ? 'none' : 'block'};
            font-weight: 500;
          }
          
          .logout-btn {
            margin: 24px 12px;
            padding: 14px 24px; 
            background: rgba(255,255,255,0.1); 
            color: rgba(255,255,255,0.9); 
            cursor: pointer; 
            text-align: center; 
            transition: all 0.3s ease;
            display: flex; 
            align-items: center; 
            justify-content: ${sidebarCollapsed ? 'center' : 'flex-start'};
            border-radius: 12px;
            font-weight: 500;
            border: 1px solid rgba(255,255,255,0.2);
          }
          
          .logout-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .logout-text {
            margin-left: ${sidebarCollapsed ? '0' : '12px'};
            display: ${sidebarCollapsed ? 'none' : 'block'};
          }
          
          /* Main Content Area */
          .dashboard-main {
            flex: 1; 
            overflow-y: auto; 
            background: #f8fafc; 
            padding: 0;
            transition: margin-left 0.3s ease;
          }
          
          .main-header {
            background: #fff; 
            padding: 24px 32px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            border-bottom: 1px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 50;
          }
          
          .page-title {
            font-size: 1.75rem; 
            font-weight: 600; 
            color: #1a202c;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .page-title:before {
            content: '';
            width: 4px;
            height: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }
          
          .main-content {
            padding: 32px;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .breadcrumb {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 8px;
          }
          
          /* Responsive Design */
          @media (max-width: 1024px) {
            .dashboard-sidebar {
              width: ${sidebarCollapsed ? '80px' : '260px'};
            }
            .main-content {
              padding: 24px;
            }
          }
          
          @media (max-width: 768px) {
            .dashboard-sidebar {
              width: ${sidebarCollapsed ? '0' : '280px'};
              position: fixed;
              left: 0;
              top: 0;
              height: 100vh;
              z-index: 200;
              transform: translateX(${sidebarCollapsed ? '-100%' : '0'});
            }
            .dashboard-main {
              margin-left: 0;
              width: 100%;
            }
            .main-header {
              padding: 16px 20px;
            }
            .main-content {
              padding: 20px;
            }
            .page-title {
              font-size: 1.5rem;
            }
          }
          
          /* Scrollbar Styling */
          .dashboard-sidebar::-webkit-scrollbar {
            width: 6px;
          }
          
          .dashboard-sidebar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
          }
          
          .dashboard-sidebar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
          }
          
          .dashboard-sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.5);
          }
        `}
      </style>
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="sidebar-header">
            <div className="sidebar-logo">
              {sidebarCollapsed ? 'GJ' : 'GJCME Admin'}
            </div>
            <div className="admin-info">Welcome, {adminName}</div>
          </div>
          
          <nav className="sidebar-nav">
            {sidebarLinks.map((link, idx) => (
              <button
                key={idx}
                className={`nav-link ${isActive(link.link, link.label) ? "active" : ""}`}
                onClick={() => {
                  if (link.link && link.link !== "#") navigate(link.link);
                }}
                title={sidebarCollapsed ? link.label : ''}
                type="button"
              >
                <span className="nav-icon">{link.iconSvg}</span>
                <span className="nav-label">{link.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="logout-btn" onClick={handleLogout} title={sidebarCollapsed ? "Logout" : ''}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="logout-text">Logout</span>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="main-header">
            <div>
              <div className="breadcrumb">
                <span>Admin Panel</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>{sidebarLinks.find(link => isActive(link.link, link.label))?.label || "Dashboard"}</span>
              </div>
              <h1 className="page-title">
                {sidebarLinks.find(link => isActive(link.link, link.label))?.label || "Dashboard"}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                padding: '8px 16px', 
                background: '#f1f5f9', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                color: '#475569',
                fontWeight: '500'
              }}>
                {adminName}
              </div>
            </div>
          </div>
          <div className="main-content">{children}</div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
