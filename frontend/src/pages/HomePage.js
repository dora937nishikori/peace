import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

function HomePage() {
  const navigate = useNavigate();

  const createNewList = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/lists`);
      const shareId = response.data.share_id;
      navigate(`/list/${shareId}`);
    } catch (error) {
      console.error('新しいリストの作成に失敗しました:', error);
      alert('リストの作成に失敗しました。時間をおいて再度お試しください。');
    }
  };

  return (
    <div className="homepage">
      <h2>ようこそ！</h2>
      <p>自分だけの「やりたいことリスト」を作成して、友達や家族と共有しましょう。</p>
      <button onClick={createNewList} className="create-list-button">
        新しいリストを作成する
      </button>
    </div>
  );
}

export default HomePage;
