require('dotenv').config(); // .envファイルを読み込む
const express = require('express');
const { Pool } = require('pg'); // PostgreSQL連携ツール

const app = express();
const port = 3000;

// データベースへの接続設定（.envのURLを使用）
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// アプリ起動時に「テーブル作成」と「初期データの挿入」を全自動で行う
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS my_data (
        id SERIAL PRIMARY KEY,
        message VARCHAR(255) NOT NULL
      );
    `);
    // テスト用のデータを1件だけ入れる
    await pool.query(`
      INSERT INTO my_data (message) 
      VALUES ('PostgreSQLデータベースとの連携、完全勝利です！🎉')
    `);
    console.log("DBの準備完了！");
  } catch (err) {
    console.error("DB初期化エラー:", err);
  }
}
initDB();

// ブラウザからアクセスが来た時の処理
app.get('/', async (req, res) => {
  try {
    // データベースから最新のメッセージを取り出す
    const result = await pool.query('SELECT message FROM my_data ORDER BY id DESC LIMIT 1');
    const dbMessage = result.rows[0] ? result.rows[0].message : "データがありません";

    // 画面に表示する
    res.send(`
      <h1>Hello EC2 Database! 🚀</h1>
      <p>データベースからのメッセージ:</p>
      <h2 style="color: blue;">${dbMessage}</h2>
    `);
  } catch (err) {
    console.error(err);
    res.send("<h1>データベース接続エラー</h1>");
  }
});

app.listen(port, () => {
  console.log(`サーバー起動中: http://localhost:${port}`);
});