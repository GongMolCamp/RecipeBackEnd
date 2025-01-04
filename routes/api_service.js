const axios = require('axios');
var express = require('express');
var router = express.Router();
var db = require('../controllers/db.js')
const {json} = require('express/lib/response.js');
const openAi = require('openai');
const {open_ai_api_key} = require('../API_KEYS/OPEN_API_KEY');


const openAiModel = new openAi({
  apiKey:open_ai_api_key
});

async function fetch_openai_api(ingredient, preference) {
  const comment = ['내가 가진 재료는 ', '이야.', '내 음식 취향은 ', '가장 적합한 요리 10개만 추천해줘.'
    + '{"result": [ {"no": 번호, "dish": 음식이름, "ingredients": [재료1, 재료2, ..., 재료]}, ...]} 이런 형태의 json으로 알려줘.'];
  const response = await openAiModel.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": comment[0] + ingredient + comment[1] 
            + comment[2] + preference + comment[1] + comment[3],
          }
        ]
      }
    ],
    
  });
  //console.log(response.choices[0].message.content);
  const result = JSON.parse(response.choices[0].message.content);
  return result;
}

// openAI api 호출 라우터
router.post('/open_ai_api/', async function (req, res) {
  console.log('in openAi api');
  const ingredient = req.body.ingredient;
  const preference = req.body.preference;

  const result = fetch_openai_api(ingredient, preference);

  res.status(200).json(result);
});

// custom search api를 이용해 이미지 검색 위한 라우터
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