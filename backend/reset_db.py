from app import app, db

# アプリケーションコンテキスト内でデータベースを初期化
with app.app_context():
    # 既存のテーブルをすべて削除
    db.drop_all()
    print("既存のテーブルを削除しました")
    
    # 新しいスキーマでテーブルを作成
    db.create_all()
    print("新しいテーブルを作成しました")
    
    print("データベースの初期化が完了しました！") 