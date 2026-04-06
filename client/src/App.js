import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import StockLevels from './pages/StockLevels';
import Operations from './pages/Operations';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h1>e-Kanban</h1>
            <span className="subtitle">Mikro ERP</span>
          </div>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end>
                <span className="nav-icon">◉</span> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/kanban">
                <span className="nav-icon">▦</span> Kanban Panosu
              </NavLink>
            </li>
            <li>
              <NavLink to="/stock">
                <span className="nav-icon">▤</span> Stok Seviyeleri
              </NavLink>
            </li>
            <li>
              <NavLink to="/operations">
                <span className="nav-icon">⚙</span> Operasyonlar
              </NavLink>
            </li>
          </ul>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/stock" element={<StockLevels />} />
            <Route path="/operations" element={<Operations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
