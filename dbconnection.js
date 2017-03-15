var mysql = require('mysql');
var connection = mysql.createPool({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'passionate_job'

});
module.exports = connection;