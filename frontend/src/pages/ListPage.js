import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TodoList from '../components/TodoList';
import DoneList from '../components/DoneList';

function ListPage() {
  const { shareId } = useParams();
  const [currentTab, setCurrentTab] = useState('todo');
  
  // このキーはタブが切り替わったときに TodoList と DoneList を再マウントさせ、
  // データを再取得させるために重要です。
  const [listUpdateKey, setListUpdateKey] = useState(Date.now());

  const handleTodoComplete = () => {
    setListUpdateKey(Date.now());
  };

  return (
    <div>
      <div className="list-url-share">
        <p>このページのURLを共有すると、他の人もリストを閲覧・編集できます。</p>
        <input type="text" readOnly value={window.location.href} onClick={(e) => e.target.select()} />
      </div>
      
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
          {currentTab === 'todo' ? (
            <TodoList key={listUpdateKey} shareId={shareId} onTodoComplete={handleTodoComplete} />
          ) : (
            <DoneList key={listUpdateKey} shareId={shareId} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ListPage;
