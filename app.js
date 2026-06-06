// app.js
const express = require('express');
const app = express();
const port = 3000;

// アクセスが来たときの画面（レスポンス）
app.get('/', (req, res) => {
  res.send('<h1>アップデート実験</h1>');
});

// サーバーの起動
app.listen(port, () => {
  console.log(`ローカルサーバー起動中: http://localhost:${port}`);
});