const axios = require('axios');
var express = require('express');
var router = express.Router();
var db = require('../controllers/db.js')
const {json} = require('express/lib/response.js');

//기본 호스팅 주소 /services/food/

// 좋아요 많이 받은 순으로 query해주는 router
router.get('/popular', function (req, res) {
    db.query('SELECT * FROM RecipeFrontDB.food_table ORDER BY food_liked DESC;', function(error, results) {
        if (error) {
            console.log(error.message);
            res.status(500).json({message : error.message});
        }
        else {
            console.log(results);
            res.status(200).json({item : results});
        }
    });
});

// openAI api에 추천 받은 음식들을 query하는 라우터
router.get('/recommended', function (req, res) {
    // req에는 json형태로 
    db.query('SELECT * FROM RecipeFrontDB.food_table WHERE food_liked DESC;', function(error, results) {
        if (error) {
            console.log(error.message);
            res.status(500).json({message : error.message});
        }
        else {
            console.log(results);
            res.status(200).json({item : results});
        }
    });
});

module.exports = router;