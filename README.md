# やりたいことリスト管理アプリ

React（フロントエンド）とFlask（バックエンド）を使用した、やりたいことリストを管理するWebアプリケーションです。

## 機能

- **やりたいことリスト**
  - 新しいやりたいことを追加
  - やりたいことの一覧表示
  - やりたいことを完了してやったことリストに移動

- **やったことリスト**
  - 完了したやりたいことの一覧表示
  - 各項目にコメントを追加・編集可能

## 技術スタック

- **フロントエンド**: React 18
- **バックエンド**: Flask
- **データベース**: SQLite
- **HTTP通信**: Axios
- **スタイリング**: CSS

## セットアップ

### バックエンド（Flask）

1. Pythonの仮想環境を作成・有効化
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

2. 依存関係をインストール
```bash
pip install -r requirements.txt
```

3. Flaskアプリケーションを起動
```bash
cd backend
python app.py
```

バックエンドは `http://localhost:5000` で起動します。

### フロントエンド（React）

1. Node.jsの依存関係をインストール
```bash
cd frontend
npm install
```

2. Reactアプリケーションを起動
```bash
npm start
```

フロントエンドは `http://localhost:3000` で起動します。

## 使用方法

1. ブラウザで `http://localhost:3000` にアクセス
2. 「やりたいこと」タブで新しいやりたいことを追加
3. 追加したやりたいことは一覧に表示されます
4. 完了ボタンをクリックして、オプションでコメントを追加してやったことリストに移動
5. 「やったこと」タブで完了したやりたいことを確認
6. やったことリストでは、コメントの追加・編集が可能

## API エンドポイント

- `GET /api/todos` - やりたいことリストの取得
- `POST /api/todos` - やりたいことの追加
- `GET /api/done` - やったことリストの取得
- `POST /api/todos/<id>/complete` - やりたいことを完了
- `PUT /api/done/<id>/comment` - やったことのコメント更新

## プロジェクト構造

```
.
├── backend/
│   └── app.py          # Flaskアプリケーション
├── frontend/
│   ├── public/
│   │   └── index.html  # メインHTMLファイル
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── TodoList.js    # やりたいことリストコンポーネント
│   │   │   │   └── DoneList.js    # やったことリストコンポーネント
│   │   │   ├── App.js      # メインアプリコンポーネント
│   │   │   ├── index.js    # エントリーポイント
│   │   │   └── index.css   # スタイルシート
│   │   └── package.json    # 依存関係
├── requirements.txt    # Python依存関係
└── README.md          # このファイル
``` 