
const axios = require('axios');
var express = require('express');
var router = express.Router();

const db = require('../controllers/async_db.js');

//기본 호스팅 주소 /services/food/

// 좋아요 많이 받은 순으로 query해주는 router
router.get('/popular', async function (req, res) {
    const [results] = await db.query('SELECT * FROM RecipeFrontDB.food_table ORDER BY food_liked DESC;');
    res.status(200).json({item : results});
});

//추천받은 음식들 업데이트된 정보로 query하는 router
router.post('/recommend', async function (req, res) {
    console.log("by session");
    //console.log(req.body.food_data);
    const food = JSON.parse(JSON.stringify(req.body.food_data))["item"];
    console.log(food);
    const lists = food.map((item) => item["food_id"]);
    console.log("end");
    
    const [result, field, error] = await db.query(
        'SELECT * FROM RecipeFrontDB.food_table WHERE food_id in ( ? );',  [lists]
    )
    if (error) console.log(error);
    //else console.log(result);
    res.status(200).json({item: result});
});

module.exports = router;
