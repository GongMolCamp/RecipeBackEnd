const axios = require('axios');
var express = require('express');
var router = express.Router();
var db = require('../controllers/db.js')
const {json} = require('express/lib/response.js');

// 프로그램 전체 쿼리
router.post('/custom_search_api/', function (req, res) {
    console.log("in Image Search");
    const name = req.body.name;
    console.log(name);
    res.send(fetchData(name));
});


// 외부 API에 GET 요청을 보내는 예시
async function fetchData(name) {
  try {
    const URI = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyChAi07dQ2hiWZqcUBTZqL5JGHc7yU4vh8&cx=a22e10f7976304da9&q=' + name;
    console.log(URI);
    // JSONPlaceholder API를 사용하여 가짜 사용자 목록 가져오기
    const response = await axios.get(URI);
    const result = response.data['items'][0]['pagemap']['cse_thumbnail'];
    // 응답 데이터 출력
    console.log(result);
    return result;
  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
    return null;
  }
}


module.exports = router;