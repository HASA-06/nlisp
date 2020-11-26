const mysql = require('mysql');
const awsRDSConfig = require('../../configs/databases/aws_rds.json');

module.exports = mysql.createPool(awsRDSConfig);