var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'campos_gaia',
    user: 'root',
    password: ''
});

connection.connect();

module.exports = connection;