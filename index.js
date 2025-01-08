

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

var apiRouter = require('./routes/api_service');
//var userRouter = require('./routes/user_service');
var foodRouter = require('./routes/food_service');
var ingredientRouter = require('./routes/ingredient_service');
var likeRouter = require('./routes/like_service');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 4000;

//라우터 설정
app.use('/services/api', apiRouter);
//app.use('/services/user', userRouter);
app.use('/services/food', foodRouter);
app.use('/services/ingredient',ingredientRouter);
app.use('/services/like', likeRouter);
// 기본 라우트 설정, 홈화면
app.get('/services/like', (req, res) => {
  res.send('Hello, Express!');
});


// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

