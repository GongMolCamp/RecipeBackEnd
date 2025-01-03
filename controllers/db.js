var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'a1234567',
    database: 'RecipeFrontDB',
    dateStrings : "date"
});
db.connect();

module.exports = db;