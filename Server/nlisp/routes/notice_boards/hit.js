const express = require('express');
const router = express.Router();
const async = require('async');

const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');

router.post('/', (req, res) => {
    let noticeBoardId = req.body.noticeBoardId;

    let noticeBoardsHitTask = [
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
            let setNoticeBoardHitParameter = {
                noticeBoardId : noticeBoardId
            };

            let setNoticeBoardHitQuery = mybatis.mappingSQLStatement('notice_boards', 'hit', 'setNoticeBoardHit', setNoticeBoardHitParameter);

            connection.query(setNoticeBoardHitQuery, (setNoticeBoardHitQueryError, setNoticeBoardHitQueryResult) => {
                connection.release();
                
                if(setNoticeBoardHitQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set notice board hit query fail',
                        content : setNoticeBoardHitQueryError
                    });

                    callback('Set notice board hit query fail\n' + setNoticeBoardHitQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Update notice board hit success',
                        contents : 'Update notice board hit task success',
                    });

                    callback(null, 'Update notice board hit success\nUpdate notice board hit task success');
                }
            });
        }
    ];

    async.waterfall(noticeBoardsHitTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : notice-boards hit task error\n' + asyncError);
        else console.log('Async Success : notice-boards hit task success\n' + asyncResult);
    });
});

module.exports = router;