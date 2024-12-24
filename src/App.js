import React from 'react';
import DynamicTree from './Tree.jsx';
import './App.css'

const App = () => {
  return (
    <div className="App">
      <header className="header-container">
      <div className="header-content">
        <h1 className="header-title">Binary Tree Visualizer</h1>
        <p className="header-subtitle">Explore Traversals and Views of a binary tree</p>
      </div>
      </header>
      <DynamicTree />
    </div>
  );
};

export default App;