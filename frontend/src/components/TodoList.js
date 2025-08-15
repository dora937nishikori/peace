import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 本番では `REACT_APP_API_BASE_URL` 環境変数を設定し、
// 未設定の場合はローカル開発用 URL を使用
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newCategory, setNewCategory] = useState('つくる');
  const [categories, setCategories] = useState(['つくる', 'でかける', 'あそぶ']);
  const [showCommentFor, setShowCommentFor] = useState(null);
  const [comment, setComment] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('つくる');

  // やりたいことリストを取得
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('やりたいことリストの取得に失敗しました:', error);
    }
  };

  // カテゴリ一覧を取得
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('カテゴリの取得に失敗しました:', error);
    }
  };

  // 新しいやりたいことを追加
  const addTodo = async () => {
    if (newTodo.trim() === '') return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, {
        title: newTodo,
        category: newCategory
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
      setNewCategory('つくる');
    } catch (error) {
      console.error('やりたいことの追加に失敗しました:', error);
    }
  };

  // やりたいことを編集
  const updateTodo = async (todoId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${todoId}`, {
        title: editTitle,
        category: editCategory
      });
      setTodos(todos.map(todo => 
        todo.id === todoId ? response.data : todo
      ));
      setEditingTodo(null);
      setEditTitle('');
      setEditCategory('つくる');
    } catch (error) {
      console.error('やりたいことの更新に失敗しました:', error);
    }
  };

  // 編集開始
  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
    setEditCategory(todo.category);
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditCategory('つくる');
  };

  // やりたいことを完了にする
  const completeTodo = async (todoId) => {
    try {
      await axios.post(`${API_BASE_URL}/todos/${todoId}/complete`, {
        comment: comment
      });
      setTodos(todos.filter(todo => todo.id !== todoId));
      setShowCommentFor(null);
      setComment('');
    } catch (error) {
      console.error('やりたいことの完了処理に失敗しました:', error);
    }
  };

  // 日付でグループ化とソートを行う関数
  const groupAndSortTodos = () => {
    // 日付順でソート
    const sortedTodos = [...todos].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // 日付でグループ化
    const grouped = sortedTodos.reduce((acc, todo) => {
      const date = new Date(todo.created_at).toLocaleDateString('ja-JP');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(todo);
      return acc;
    }, {});

    return grouped;
  };

  // ソート順を切り替える
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  // カテゴリアイコンを取得
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'つくる': return '🔨';
      case 'でかける': return '🚀';
      case 'あそぶ': return '🎮';
      default: return '📝';
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, []);

  const groupedTodos = groupAndSortTodos();

  return (
    <div>
      <div className="input-section">
        <h2>新しいやりたいことを追加</h2>
        <div className="input-group">
          <input
            type="text"
            className="input-field"
            placeholder="やりたいことを入力してください"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <select
            className="category-select"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {getCategoryIcon(cat)} {cat}
              </option>
            ))}
          </select>
          <button className="add-button" onClick={addTodo}>
            追加
          </button>
        </div>
      </div>

      <div className="list-container">
        <div className="list-header">
          <h2>やりたいことリスト ({todos.length}件)</h2>
          <button className="sort-button" onClick={toggleSortOrder}>
            日付順: {sortOrder === 'desc' ? '新しい順 ↓' : '古い順 ↑'}
          </button>
        </div>
        
        {todos.length === 0 ? (
          <p>やりたいことがありません。上記のフォームから追加してください。</p>
        ) : (
          Object.entries(groupedTodos).map(([date, todosInDate]) => (
            <div key={date} className="date-group">
              <div className="date-header">
                <span className="date-label">{date}</span>
                <span className="count-label">({todosInDate.length}件)</span>
              </div>
              
              {todosInDate.map(todo => (
                <div key={todo.id} className="list-item">
                  <div className="item-content">
                    {editingTodo === todo.id ? (
                      <div className="edit-section">
                        <div className="edit-group">
                          <input
                            type="text"
                            className="edit-input"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <select
                            className="edit-category-select"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>
                                {getCategoryIcon(cat)} {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="edit-buttons">
                          <button 
                            className="save-button"
                            onClick={() => updateTodo(todo.id)}
                          >
                            保存
                          </button>
                          <button 
                            className="cancel-button"
                            onClick={cancelEditing}
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="item-header">
                          <div className="item-title">{todo.title}</div>
                          <div className="item-category">
                            {getCategoryIcon(todo.category)} {todo.category}
                          </div>
                        </div>
                        <div className="item-time">
                          {new Date(todo.created_at).toLocaleTimeString('ja-JP', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </>
                    )}
                    
                    {showCommentFor === todo.id && (
                      <div className="comment-section">
                        <textarea
                          className="comment-input"
                          placeholder="完了時のコメントを入力してください（任意）"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows="3"
                        />
                        <button 
                          className="comment-button"
                          onClick={() => completeTodo(todo.id)}
                        >
                          完了
                        </button>
                        <button 
                          className="comment-button"
                          onClick={() => {
                            setShowCommentFor(null);
                            setComment('');
                          }}
                          style={{marginLeft: '10px', backgroundColor: '#666'}}
                        >
                          キャンセル
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingTodo !== todo.id && showCommentFor !== todo.id && (
                    <div className="item-actions">
                      <button 
                        className="edit-button"
                        onClick={() => startEditing(todo)}
                      >
                        編集
                      </button>
                      <button 
                        className="complete-button"
                        onClick={() => setShowCommentFor(todo.id)}
                      >
                        完了
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList; 