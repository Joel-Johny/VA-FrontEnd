import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import CameraConfig from './Components/CameraConfig';
import AnalyticsConfig from './Components/AnalyticsConfig';
import Event from './Components/EventMonitor';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cameraconfig" element={<CameraConfig />} />
          <Route path="/analyticsconfig" element={<AnalyticsConfig />} />
          <Route path="/event" element={<Event />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

