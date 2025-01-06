const axios = require('axios');
var express = require('express');
var router = express.Router();
const openAi = require('openai');
const {open_ai_api_key} = require('../API_KEYS/OPEN_API_KEY');
const fs = require('fs');
const db = require('../controllers/async_db.js');
const { type } = require('os');

//mysql2/pool 에서 query에 function을 넣는것을 제한하고 있음.
// 해결 방안, ex const [result, columns] = db.query("");

const openAiModel = new openAi({
  apiKey:open_ai_api_key
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

// 이름 배열을 통해 db에 저장된 음식데이터 반환하는 메소드
async function query_food_by_name(params, res) {
  const name_list = params;
  const statement = 'SELECT * FROM RecipeFrontDB.food_table WHERE food_name IN (' 
  + JSON.stringify(name_list).slice(1, -1) + ')';
  console.log(statement);
  
  const[results, fields] = await db.query(statement);
  //console.log(results);
  //console.log(fields);
  res.status(200).send(results);
}


//받은 음식 리스트를 food_table에 insert하는 메소드
async function insert_food_table (datas) {
  //api 사용 최소화를 위해 테스트데이터 사용 코드
  /*
  var data = fs.readFileSync('/Users/yejun/projects/RecipeBackEnd/routes/tmp_data.json');
  data = JSON.parse(data);
  */

  // object to array, 데이터베이스에 음식 데이터가 없으면 추가.
  let dish_list =  Array.from(datas["result"], (item) => item);
  console.log(dish_list);
  for (item of dish_list) {
    const [return_data1, fields1] = await db.query('SELECT * FROM RecipeFrontDB.food_table WHERE food_name = ?', [item["dish"]]);
    if (return_data1.length == 0) {
      const src = await search_image(item["dish"]);
      const [return_data2, fields2] = await db.query('INSERT INTO RecipeFrontDB.food_table (food_name, food_recipe, food_image_src) VALUES (?, ?, ?)', [item["dish"], item["recipe"], src]); 
    }
  }
  return Array.from(datas["result"], (item) => item["dish"]);
}

//openAi api에 재료와 취향을 입력하여 결과값을 받아오는 메소드
async function fetch_openai_api(ingredient, preference) {
  const comment = ['내가 가진 재료는 ', '이야.', '내 음식 취향은 ', '가장 적합한 요리 10개만 추천해줘.'
    + '{"result": [ {"dish": 음식이름, "recipe": 레시피 설명}]} 이런 형태의 json으로 알려줘. 레시피 설명은 엄청 자세하고 세부적으로 알려줘.'];
  const response = await openAiModel.chat.completions.create({
    model: "gpt-4",
    temperature: 0,
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
  //console.log(result);
  return result;
}

// openAI api 호출 라우터
router.post('/ask_recipe', async function (req, res) {
  console.log('in openAi api');
  const ingredient = req.body.ingredient;
  const preference = req.body.preference;
  
  // api 호출
  const result = await fetch_openai_api(ingredient, preference);
  
  // food_table에 insert
  const data = await insert_food_table(result);
  // food_table query해서 response 전송!
  await query_food_by_name(data, res);
  //res.status(200).send({message : "end"});
});

//test용임.
// custom search api를 이용해 이미지 검색 위한 라우터
router.post('/custom_search_api', function (req, res) {
    console.log("in Image Search");
    const name = req.body.name;
    console.log(name);
    res.send(search_image(name));
});


module.exports = router;