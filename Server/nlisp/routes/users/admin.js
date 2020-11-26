const express = require('express');
const router = express.Router();
const async = require('async');

const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');

router.get('/', (req, res) => {
	let usersAdminTask = [
		(callback) => {
			awsRds.getConnection((connectingRDSError, connectingRDSResult) => {
        if(connectingRDSError) {
          res.status(500).send({
              stat : 'Fail',
              title : 'Connecting RDS fail',
              contents : connectingRDSError
          });

          callback('Connecting RDS fail\n'+ connectingRDSError);
        } else {
          callback(null, connectingRDSResult);
        }
	    });
		},
		(connection, callback) => {
			let getAdminDataParameter = null;

			let getAdminDataQuery = mybatis.mappingSQLStatement('users', 'admin', 'getAdminData', getAdminDataParameter);

			connection.query(getAdminDataQuery, (getAdminDataQueryError, getAdminDataQueryResult) => {
				connection.release();

				if(getAdminDataQueryError) {
					res.status(500).send({
						stat : 'Fail',
						title : 'Get admin data query fail',
						content : getAdminDataQueryError
					});

					callback('Get admin data query fail\n' + getAdminDataQueryError);
				} else {
					res.status(200).send({
						stat : 'Success',
						title : 'Get admin data success',
						content : 'Get admin data task success, please check data',
						adminDatas : getAdminDataQueryResult
					});

					callback(null, 'Get admin data success\nGet admin data task success, please check data');
				}
			});
		}
	];

	async.waterfall(usersAdminTask, (asyncError, asyncResult) => {
      if(asyncError) console.log('Async Fail : Users admin task error\n' + asyncError);
      else console.log('Async Success : Users admin task success\n' + asyncResult);
  });
})

module.exports = router;