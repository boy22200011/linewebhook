import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Service is running!");
  });
  

app.post('/getTestStr', (req, res) => {
  return res.status(200).json({ code: 0, message: "Hello World!" });
});

// 修改端口設定
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
