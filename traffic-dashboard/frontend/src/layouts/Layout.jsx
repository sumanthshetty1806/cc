// src/layouts/Layout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Layout({ contextPayload }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Traffic Analysis Dashboard</h1>
      </header>

      <nav className="dashboard-navbar">
        <NavLink to="/overview" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Overview
        </NavLink>
        <NavLink to="/analytics" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Correlation Matrices
        </NavLink>
        <NavLink to="/infrastructure" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Infrastructure Eng.
        </NavLink>
        <NavLink to="/explorer" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          Data Explorer
        </NavLink>
      </nav>

      <main className="dashboard-content">
        <Outlet context={contextPayload} />
      </main>
    </div>
  );
}
