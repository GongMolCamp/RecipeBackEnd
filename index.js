// index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

var apiRouter = require('./routes/api_service');
//var userRouter = require('./routes/user_service');
var foodRouter = require('./routes/food_service');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
const tmp = '{"result": [{"no": 1, "dish": "불고기", "ingredients": ["소고기", "마늘", "간장", "설탕", "파", "양파"]},{"no": 2, "dish": "짜장면", "ingredients": ["돼지고기", "파스타면", "마늘", "양파", "간장", "설탕"]},{"no": 3, "dish": "짬뽕", "ingredients": ["돼지고기", "파스타면", "마늘", "양파", "고추장", "양배추"]},{"no": 4, "dish": "볶음밥", "ingredients": ["닭고기", "계란", "마늘", "파", "양파", "밥"]},{"no": 5, "dish": "닭볶음탕", "ingredients": ["닭고기", "마늘", "양파", "고추장", "설탕", "양배추", "맛술"]},{"no": 6, "dish": "라면", "ingredients": ["라면", "계란", "파", "양파"]},{"no": 7, "dish": "덮밥", "ingredients": ["돼지고기", "밥", "계란", "양파", "간장", "설탕"]},{"no": 8, "dish": "소고기볶음", "ingredients": ["소고기", "마늘", "양파", "파", "간장", "맛술"]},{"no": 9, "dish": "파스타", "ingredients": ["파스타면", "마늘", "양파", "돼지고기", "소고기"]},{"no": 10, "dish": "양배추볶음", "ingredients": ["양배추", "마늘", "양파", "간장", "설탕", "돼지고기"]}]}';
const tmp_to_json = JSON.parse(tmp);
console.log(tmp_to_json);
console.log(typeof tmp_to_json);
console.log(tmp_to_json['result'][0]);
*/
const port = 4000;

//라우터 설정
app.use('/services/api', apiRouter);
//app.use('/services/user', userRouter);
app.use('/services/food', foodRouter);

// 기본 라우트 설정, 홈화면
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});


// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
