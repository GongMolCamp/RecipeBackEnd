// index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

var apiRouter = require('./routes/api_service');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 4000;


app.use('/services/api', apiRouter);

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});


// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
