
const axios = require('axios');
var express = require('express');
var router = express.Router();

const db = require('../controllers/async_db.js');
const sql = require('../controllers/async_db.js');

//기본 호스팅 주소 /services/like/

// 사용자가 음식에 좋아요를 눌렀는지 query해주는 라우터
router.post('/', async function (req, res) {
    const userId = req.body["user_id"];
    const foodId = req.body["food_id"];
    console.log(userId , " , ", foodId);
    const [results, fields] = await db.query('SELECT * FROM RecipeFrontDB.liked_table WHERE liked_user_id = ? AND liked_food_id = ?;', [userId, foodId]);
    console.log(results.length);
    res.status(200).json({item : results.length});
}); 

async function update_food_liked (foodId, num, res) {
    const sql_statement = "UPDATE RecipeFrontDB.food_table SET food_liked = food_liked "
    + num + " 1 WHERE food_id = ?";
    const [results, error] = await db.query(sql_statement, [foodId]);
    if (error) {
        res.status(400).json({message : "error"});
    }
    else {
        console.log(results);
    }
    res.status(200).json({message : "success"});
}

// 사용자가 음식에 좋아요를 눌렀을때 호출하는 라우터
router.post('/add', async function (req, res) {
    const userId = req.body["user_id"];
    const foodId = req.body["food_id"];
    console.log(userId , " , ", foodId);
    const [results, error, fields] = await db.query('INSERT INTO RecipeFrontDB.liked_table (liked_user_id, liked_food_id) VALUES (?, ?);', [userId, foodId]);
    if (error) {
        res.status(400).json({message : "error"});
    }
    else {
        console.log(results);
    }
    await update_food_liked(foodId, "+", res);
}); 

// 사용자가 음식에 누를 좋아요를 취소할때 호출하는 라우터
router.post('/delete', async function (req, res) {
    const userId = req.body["user_id"];
    const foodId = req.body["food_id"];
    console.log(userId , " , ", foodId);
    const [results, error, fields] = await db.query('DELETE FROM RecipeFrontDB.liked_table WHERE liked_user_id = ? AND liked_food_id = ?;', [userId, foodId]);
    if (error) {
        res.status(400).json({message : "error"});
    }
    else {
        console.log(results);
    }
    await update_food_liked(foodId, "+", res);
}); 

module.exports = router;
