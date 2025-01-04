const axios = require('axios');
var express = require('express');
var router = express.Router();
var db = require('../controllers/db.js')
const {json} = require('express/lib/response.js');

//기본 호스팅 주소 /services/food/

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

module.exports = router;