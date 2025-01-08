var express = require('express');
var router = express.Router();
var db = require('../controllers/db.js');
const { json } = require('express/lib/response.js');

//기본 호스팅 주소 /services/ingredient/

//사용자의 id에 맞춰 냉장고 재료들을 보여줌
router.get('/', function (req, res) {
    //const id = req.params.id; // 경로 매개변수에서 id 값 추출
    const id="1";

    db.query('SELECT * FROM RecipeFrontDB.ingredient_table WHERE ingredient_id=?', [id], function(error, results) {
        if (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        } else {
            console.log(results);
            res.status(200).json({ item: results });
        }
    });
});

//냉장고에 재료추가 
router.post('/', function (req, res) {
    const { id, reftype, name } = req.body;

    if (!id || !name || !reftype) {
        return res.status(400).json({ message: 'id, name, and reftype are required' });
    }

    db.query('INSERT INTO RecipeFrontDB.ingredient_table (ingredient_id, ingredient_type, ingredient_name) VALUES (?, ?, ?)', [id, reftype, name], function(error, results) {
        if (error) {
            console.error('Database error:', error.message);
            return res.status(500).json({ message: 'Database error', error: error.message });
        } else {
            return res.status(201).json({ message: 'Ingredient added successfully', id: id });
        }
    });
});



module.exports = router;

