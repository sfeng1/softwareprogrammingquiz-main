/************************************************************************
Project: Software Programming Quiz
Author: Li, Feng, Tauiliili
Created: 2024-01-24
Last Updated: 2024-02-01
************************************************************************/
var mysql = require('mariadb');

var pool = mysql.createPool({
    host: 'classmysql.engr.oregonstate.edu', 
    user:'capstone_2024_software_programming_quiz_1', 
    password: 'CS467spq2024',
    database: 'capstone_2024_software_programming_quiz_1',
    connectionLimit: 5
});

module.exports = pool;
