import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 本番では `REACT_APP_API_BASE_URL` 環境変数を設定し、
// 未設定の場合はローカル開発用 URL を使用
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

function DoneList({ shareId }) {
  const [doneItems, setDoneItems] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [newComment, setNewComment] = useState('');

  // やったことリストを取得
  const fetchDoneItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lists/${shareId}/done`);
      setDoneItems(response.data);
    } catch (error) {
      console.error('やったことリストの取得に失敗しました:', error);
    }
  };

  // コメントを更新
  const updateComment = async (doneId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/lists/${shareId}/done/${doneId}/comment`, {
        comment: newComment
      });
      setDoneItems(doneItems.map(item => 
        item.id === doneId ? response.data : item
      ));
      setEditingComment(null);
      setNewComment('');
    } catch (error) {
      console.error('コメントの更新に失敗しました:', error);
    }
  };

  // コメント編集の開始
  const startEditingComment = (item) => {
    setEditingComment(item.id);
    setNewComment(item.comment || '');
  };

  // コメント編集のキャンセル
  const cancelEditingComment = () => {
    setEditingComment(null);
    setNewComment('');
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
    if (shareId) {
      fetchDoneItems();
    }
  }, [shareId]);

  return (
    <div>
      <div className="list-container">
        <h2>やったことリスト ({doneItems.length}件)</h2>
        {doneItems.length === 0 ? (
          <p>まだやったことがありません。「やりたいこと」タブから項目を完了してください。</p>
        ) : (
          doneItems.map(item => (
            <div key={item.id} className="list-item">
              <div className="item-content">
                <div className="item-header">
                  <div className="item-title">{item.title}</div>
                  <div className="item-category">
                    {getCategoryIcon(item.category)} {item.category}
                  </div>
                </div>
                <div className="item-date">
                  完了日: {new Date(item.completed_at).toLocaleString('ja-JP')}
                </div>
                
                {editingComment === item.id ? (
                  <div className="comment-section">
                    <textarea
                      className="comment-input"
                      placeholder="コメントを入力してください"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows="3"
                    />
                    <button 
                      className="comment-button"
                      onClick={() => updateComment(item.id)}
                    >
                      保存
                    </button>
                    <button 
                      className="comment-button"
                      onClick={cancelEditingComment}
                      style={{marginLeft: '10px', backgroundColor: '#666'}}
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <div>
                    {item.comment ? (
                      <div className="item-comment">
                        コメント: {item.comment}
                      </div>
                    ) : (
                      <div className="item-comment" style={{color: '#999'}}>
                        コメントなし
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {editingComment !== item.id && (
                <button 
                  className="complete-button"
                  onClick={() => startEditingComment(item)}
                  style={{backgroundColor: '#2196F3'}}
                >
                  {item.comment ? 'コメント編集' : 'コメント追加'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoneList; 