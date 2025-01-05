const axios = require('axios');
var express = require('express');
var router = express.Router();
var db = require('../controllers/db.js')
const {json} = require('express/lib/response.js');
const openAi = require('openai');
const {open_ai_api_key} = require('../API_KEYS/OPEN_API_KEY');
const fs = require('fs');

const openAiModel = new openAi({
  apiKey:open_ai_api_key
});

// fetch => db insert => db query => return json

// 이미지 생성 호출 메소드

//받은 음식 리스트를 food_table에 insert하는 메소드
async function insert_food_table (datas) {
  //api 사용 최소화를 위해 테스트데이터 사용 코드
  
  var data = fs.readFileSync('/Users/yejun/projects/RecipeBackEnd/routes/tmp_data.json');
  data = JSON.parse(data);
 
  // object to array, 데이터베이스에 음식 데이터가 없으면 추가.
  let dish_list =  Array.from(data["result"], (item) => item);
  data_list = dish_list.map((item) => {
    db.query('SELECT * FROM RecipeFrontDB.food_table WHERE food_name = ?',
       [item["dish"]], async function(error, results) {
        
      if (error) {
          console.log(error.message);
      }
      else if (results.length > 0) {

      }
      else {
        //console.log(item["dish"]);
        const src = await search_image(item["dish"]);
        
        db.query('INSERT INTO RecipeFrontDB.food_table (food_name, food_recipe, food_image_src) VALUES (?, ?, ?)', [item["dish"], item["recipe"], src]
          , function(error, results) {
            if (error) console.log(error);
          }
        );    
      }
    });
  });
}

//openAi api에 재료와 취향을 입력하여 결과값을 받아오는 메소드
async function fetch_openai_api(ingredient, preference) {
  const comment = ['내가 가진 재료는 ', '이야.', '내 음식 취향은 ', '가장 적합한 요리 10개만 추천해줘.'
    + '{"result": [ {"dish": 음식이름, "recipe": 레시피 설명}]} 이런 형태의 json으로 알려줘. 레시피 설명은 엄청 자세하고 세부적으로 알려줘.'];
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
    ]
  });
  //console.log(response.choices[0].message.content);
  const result = JSON.parse(response.choices[0].message.content);
  console.log(result);
  return result;
}


// openAI api 호출 라우터
router.post('/open_ai_api/', async function (req, res) {
  console.log('in openAi api');
  const ingredient = req.body.ingredient;
  const preference = req.body.preference;
  
  /*
  const result = await fetch_openai_api(ingredient, preference);
  insert_food_table(result);
  res.status(200).send(result);  
  */
  insert_food_table("");
  res.send({message : 'success'});
});

//test용임.
// custom search api를 이용해 이미지 검색 위한 라우터
router.post('/custom_search_api/', function (req, res) {
    console.log("in Image Search");
    const name = req.body.name;
    console.log(name);
    res.send(search_image(name));
});


// 외부 API에 GET 요청을 보내는 예시
async function search_image(name) {
  try {
    const URI = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyChAi07dQ2hiWZqcUBTZqL5JGHc7yU4vh8&cx=a22e10f7976304da9&q=' + name;
    //console.log(URI);
    // JSONPlaceholder API를 사용하여 가짜 사용자 목록 가져오기
    const response = await axios.get(URI);
    const result = response.data['items'][0]['pagemap']['cse_thumbnail'];

    // 응답 데이터 리턴
    const result_src = result[0]["src"];
    return result_src;
  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
    return "정보 없음";
  }
}


module.exports = router;