import React from 'react';

const Dashboard = () => {
  const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#F7F9FB'
  };

  const headerFooterStyle = {
    background: 'linear-gradient(90deg, #687864 0%, #5085A5 100%)',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };

  const mainContentStyle = {
    flex: '1',
    padding: '40px 20px',
    textAlign: 'center',
    color: '#333'
  };

  return (
    <div style={layoutStyle}>
      <header style={headerFooterStyle}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '2px' }}>SAVESOME</h1>
      </header>

      <main style={mainContentStyle}>
        <h2 style={{ color: '#5085A5' }}>Welcome to Your Dashboard</h2>
        <p>This is where your application content will be displayed.</p>
      </main>

      <footer style={headerFooterStyle}>
        <p style={{ margin: 0 }}>© 2024 SAVESOME. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
