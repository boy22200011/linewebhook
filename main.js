import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({ code: 0, message: "this is get!" });
});

app.post('/getTestStr', (req, res) => {
  return res.status(200).json({ code: 0, message: "Hello World!" });
});

// 修改端口設定
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
