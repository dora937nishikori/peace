import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container">
        <h1 className="header">やりたいことリスト管理</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list/:shareId" element={<ListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 