const Mysql = require('mysql2/promise');

const sql = Mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'a1234567',
    database: 'RecipeFrontDB',
    dateStrings : "date"
});

module.exports = sql;
/*
// getting tx pending list from db
async function getTxPendingList() {
    try {
        const query = "SELECT * FROM transactions WHERE `state` = 'pending'";
        const rows = await sql.query(query);
        return rows[0];
    } catch (err) {
        console.log('ERROR => ' + err);
        return err;
    }
}
    */