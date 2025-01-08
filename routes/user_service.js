const axios = require('axios');
var express = require('express');
var router = express.Router();

const db = require('../controllers/db.js');

router.post('/login', (req, res) => {
    const { user_id, user_password } = req.body;
  
    if (!user_id || !user_password) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해 주세요.' });
    }
  
    const sql = 'SELECT * FROM recipefrontdb.user_table WHERE user_id = ? AND user_password = ?';
    db.query(sql, [user_id, user_password], (err, results) => {
      if (err) {
        console.error('Error executing query:', err.message);
        return res.status(500).json({ success: false, message: '서버 오류' });
      }
  
      if (results.length > 0) {
        res.json({ success: true, message: '로그인 성공' });
      } else {
        res.status(401).json({ success: false, message: 'ID 또는 비밀번호가 일치하지 않습니다.' });
      }
    });
  });
  
  // 회원가입 요청 처리
  router.post('/join', (req, res) => {
      const { user_email, user_password, user_id, user_preference1, user_preference2, user_preference3} = req.body;
    
      if (!user_email || !user_password || !user_id) {
        return res.status(400).json({ success: false, message: '모든 필드를 입력해 주세요.' });
      }
    
      const sql = 'INSERT INTO recipefrontdb.user_table (user_email, user_password, user_id, user_preference1, user_preference2, user_preference3) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(sql, [user_email, user_password, user_id, user_preference1, user_preference2, user_preference3], (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
              return res.status(409).json({ success: false, message: '이미 존재하는 이메일입니다.' });
          }
          console.error('Error inserting user:', err.message);
          return res.status(500).json({ success: false, message: '서버 오류' });
        }
    
        res.status(201).json({ success: true, message: '회원가입 성공!' });
      });
    });

    module.exports = router;