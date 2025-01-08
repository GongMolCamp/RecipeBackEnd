
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

module.exports = router;
