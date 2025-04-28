import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@mui/material';
import LiveMatches from './components/LiveMatches';
import './App.css';

const tabs = ['Merged', 'Live', 'Recent', 'Teams', 'Competition', 'Country'];
const endpointMap = {
  Merged: '/merged',
  Live: '/live',
  Recent: '/recent',
  Teams: '/teams',
  Competition: '/competition',
  Country: '/country'
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTabIndex = tabs.findIndex(tab => location.pathname === endpointMap[tab]);
  const handleChange = (event, newValue) => {
    navigate(endpointMap[tabs[newValue]].slice(1));
  };
  return (
    <div className="App">
      <AppBar position="static" color="default" sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Tabs
          value={currentTabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          TabIndicatorProps={{ style: { height: 3, backgroundColor: '#1976d2' } }}
          sx={{ backgroundColor: '#ffffff' }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab}
              label={tab}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
            />
          ))}
        </Tabs>
      </AppBar>
      <div className="tab-content">
        <Routes>
          <Route path="/" element={<Navigate to="/live" replace />} />
          <Route path="live" element={<LiveMatches />} />
          <Route path="merged" element={<></>} />
          <Route path="recent" element={<></>} />
          <Route path="teams" element={<></>} />
          <Route path="competition" element={<></>} />
          <Route path="country" element={<></>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
