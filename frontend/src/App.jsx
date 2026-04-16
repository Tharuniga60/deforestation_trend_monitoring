import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Trends from './components/Trends'
import Hotspots from './components/Hotspots'
import Charts from './components/Charts'
import Report from './components/Report'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1>DeforestWatch</h1>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
            <NavLink to="/trends" className={({ isActive }) => isActive ? 'active' : ''}>Trends</NavLink>
            <NavLink to="/hotspots" className={({ isActive }) => isActive ? 'active' : ''}>Hotspots</NavLink>
            <NavLink to="/charts" className={({ isActive }) => isActive ? 'active' : ''}>Charts</NavLink>
            <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>Report</NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/hotspots" element={<Hotspots />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App