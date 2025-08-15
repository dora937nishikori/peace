from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# データベース設定
# 本番(Render)では環境変数 DATABASE_URL(PostgreSQL) を使用し、
# ローカル開発時は SQLite をデフォルトとする
database_url = os.environ.get('DATABASE_URL')

# Render の DB URL は "postgres://" で始まる場合があるため SQLAlchemy 用に変換
if database_url:
    database_url = database_url.replace('postgres://', 'postgresql://', 1)
else:
    database_url = 'sqlite:///todo.db'

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# データベースモデル
class TodoItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(20), default='つくる')  # 'つくる', 'でかける', 'あそぶ'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='todo')  # 'todo' または 'done'

class DoneItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(20), default='つくる')  # カテゴリも保存
    comment = db.Column(db.Text)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

# データベース初期化
with app.app_context():
    db.create_all()

# やりたいことリストの取得
@app.route('/api/todos', methods=['GET'])
def get_todos():
    todos = TodoItem.query.filter_by(status='todo').all()
    return jsonify([{
        'id': todo.id,
        'title': todo.title,
        'category': todo.category,
        'created_at': todo.created_at.isoformat()
    } for todo in todos])

# やりたいことリストに追加
@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    new_todo = TodoItem(
        title=data['title'],
        category=data.get('category', 'つくる')
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({
        'id': new_todo.id,
        'title': new_todo.title,
        'category': new_todo.category,
        'created_at': new_todo.created_at.isoformat()
    }), 201

# やりたいことを編集
@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = TodoItem.query.get_or_404(todo_id)
    data = request.get_json()
    
    todo.title = data.get('title', todo.title)
    todo.category = data.get('category', todo.category)
    
    db.session.commit()
    
    return jsonify({
        'id': todo.id,
        'title': todo.title,
        'category': todo.category,
        'created_at': todo.created_at.isoformat()
    })

# やったことリストの取得
@app.route('/api/done', methods=['GET'])
def get_done():
    done_items = DoneItem.query.all()
    return jsonify([{
        'id': item.id,
        'title': item.title,
        'category': item.category,
        'comment': item.comment,
        'completed_at': item.completed_at.isoformat()
    } for item in done_items])

# やったことに移動
@app.route('/api/todos/<int:todo_id>/complete', methods=['POST'])
def complete_todo(todo_id):
    todo = TodoItem.query.get_or_404(todo_id)
    data = request.get_json()
    
    # やったことリストに追加（カテゴリも一緒に移動）
    done_item = DoneItem(
        title=todo.title,
        category=todo.category,
        comment=data.get('comment', '')
    )
    db.session.add(done_item)
    
    # やりたいことリストから削除
    db.session.delete(todo)
    db.session.commit()
    
    return jsonify({
        'id': done_item.id,
        'title': done_item.title,
        'category': done_item.category,
        'comment': done_item.comment,
        'completed_at': done_item.completed_at.isoformat()
    })

# やったことのコメント更新
@app.route('/api/done/<int:done_id>/comment', methods=['PUT'])
def update_comment(done_id):
    done_item = DoneItem.query.get_or_404(done_id)
    data = request.get_json()
    done_item.comment = data['comment']
    db.session.commit()
    
    return jsonify({
        'id': done_item.id,
        'title': done_item.title,
        'category': done_item.category,
        'comment': done_item.comment,
        'completed_at': done_item.completed_at.isoformat()
    })

# カテゴリ一覧の取得
@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify(['つくる', 'でかける', 'あそぶ'])

if __name__ == '__main__':
    app.run(debug=True) 