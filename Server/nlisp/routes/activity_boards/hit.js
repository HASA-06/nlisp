const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const activityBoardsValidity = require('../../private_modules/validitys/activity_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /activity-boards/hit is connected'
    });
});

router.post('/', (req, res) => {
    let activityBoardId = req.body.activityBoardId;

    let activityBoardsHitTask = [
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
            let setActivityBoardHitParameter = {
                activityBoardId : activityBoardId
            };

            let setActivityBoardHitQuery = mybatis.mappingSQLStatement('activity_boards', 'hit', 'setActivityBoardHit', setActivityBoardHitParameter);

            connection.query(setActivityBoardHitQuery, (setActivityBoardHitQueryError, setActivityBoardHitQueryResult) => {
                connection.release();
                
                if(setActivityBoardHitQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set activity board hit query fail',
                        content : setActivityBoardHitQueryError
                    });

                    callback('Set activity board hit query fail\n' + setActivityBoardHitQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Update activity board hit success',
                        contents : 'Update activity board hit task success',
                    });

                    callback(null, 'Update activity board hit success\nUpdate activity board hit task success');
                }
            });
        }
    ];

    async.waterfall(activityBoardsHitTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Activity-boards hit task error\n' + asyncError);
        else console.log('Async Success : Activity-boards hit task success\n' + asyncResult);
    });
});

module.exports = router;