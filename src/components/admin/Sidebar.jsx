import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const menuItemStyle = {
    padding: '12px 24px', 
    cursor: 'pointer',
    borderBottom: '1px solid #eaeaea',
    transition: 'background-color 0.2s'
  };
  
  const activeStyle = {
    ...menuItemStyle,
    backgroundColor: '#e6f7ff',
    borderLeft: '3px solid #1890ff'
  };
  
  return (
    <div style={{ width: '250px', background: '#f8f8f8', height: '100vh', padding: '20px 0', boxSizing: 'border-box', borderRight: '1px solid #ddd' }}>
      <div style={{ padding: '0 24px 20px', borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
        <h3 style={{ margin: '0', color: '#1890ff' }}>Admin Panel</h3>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li 
          style={menuItemStyle} 
          onClick={() => navigate('/dashboard')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          Dashboard
        </li>
        
        <li 
          style={menuItemStyle} 
          onClick={() => navigate('/admin/profile')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          My Profile
        </li>
        
        <li 
          style={menuItemStyle} 
          onClick={() => navigate('/admin/users')}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          User Management
        </li>
        
        <li 
          style={{...menuItemStyle, marginTop: '20px', color: '#ff4d4f'}} 
          onClick={() => {
            localStorage.removeItem('adminName');
            localStorage.removeItem('adminUser');
            navigate('/admin/login');
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff1f0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar; 