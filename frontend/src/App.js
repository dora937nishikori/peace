import React, { useState } from 'react';
import TodoList from './components/TodoList';
import DoneList from './components/DoneList';

function App() {
  const [currentTab, setCurrentTab] = useState('todo');

  return (
    <div className="container">
      <h1 className="header">やりたいことリスト管理</h1>
      
      <div className="tabs-container">
        <div className="tabs">
          <div 
            className={`tab ${currentTab === 'todo' ? 'active' : ''}`}
            onClick={() => setCurrentTab('todo')}
          >
            やりたいこと
          </div>
          <div 
            className={`tab ${currentTab === 'done' ? 'active' : ''}`}
            onClick={() => setCurrentTab('done')}
          >
            やったこと
          </div>
        </div>
        
        <div className="tab-content">
          {currentTab === 'todo' ? <TodoList /> : <DoneList />}
        </div>
      </div>
    </div>
  );
}

export default App; 