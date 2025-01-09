var express = require('express');
var router = express.Router();
var db = require('../controllers/db.js');
const { json } = require('express/lib/response.js');

//기본 호스팅 주소 /services/ingredient/

//사용자의 id에 맞춰 냉장고 재료들을 보여줌
router.get('/', function (req, res) {
    //const id = req.params.id; // 경로 매개변수에서 id 값 추출
    const id=req.query.id || "1";

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
router.post('/', (req, res) => {
    const { id, reftype, name } = req.body;

    if (!id || !reftype || !name) {
        return res.status(400).json({ message: 'id, reftype, and name are required' });
    }

    // 중복 확인 및 삽입
    db.query(
        'SELECT * FROM ingredient_table WHERE ingredient_id = ? AND ingredient_type = ? AND ingredient_name = ?',
        [id, reftype, name],
        (error, results) => {
            if (error) {
                console.error('Database error:', error.message);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Duplicate entry' });
            }

            // 중복이 없으면 삽입
            db.query(
                'INSERT INTO ingredient_table (ingredient_id, ingredient_type, ingredient_name) VALUES (?, ?, ?)',
                [id, reftype, name],
                (error) => {
                    if (error) {
                        console.error('Database error:', error.message);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    return res.status(200).json({ message: 'Ingredient added successfully' });
                }
            );
        }
    );
});



router.delete('/', function (req, res) {
    const { id, reftype, name } = req.body;

    if (!id || !name || !reftype) {
        return res.status(400).json({ message: 'id, name, and reftype are required' });
    }

    const sql = `
        DELETE FROM RecipeFrontDB.ingredient_table 
        WHERE ingredient_id = ? AND ingredient_type = ? AND ingredient_name = ?;
    `;

    db.query(sql, [id, reftype, name], function (error, results) {
        if (error) {
            console.error('Database error:', error.message);
            return res.status(500).json({ message: 'Database error', error: error.message });
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No matching ingredient found to delete' });
        } else {
            return res.status(200).json({ message: 'Ingredient deleted successfully', id: id });
        }
    });
});




module.exports = router;