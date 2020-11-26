const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const scheduleBoardValidity = require('../../private_modules/validitys/schedule_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /schedule-boards/delete is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    let scheduleBoardId = req.body.scheduleBoardId;

    let scheduleBoardsDeleteTask = [
        (callback) => {
            tokenValidity.tokenCheck(userToken, (tokenCheckError, tokenCheckResult) => {
                if(tokenCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Token check fail',
                        contents : tokenCheckError
                    });

                    callback('Toekn check fail\n' + tokenCheckError);
                } else {
                    callback(null, tokenCheckResult);
                }
            });
        },
        (tokenCheckResult, callback) => {
            jwt.checkToken(userToken, (checkTokenError, checkTokenResult) => {
                if(checkTokenError) {
                    res.status(401).send({
                        stat : 'Fail',
                        title : 'Check token fail',
                        contents : checkTokenError
                    });

                    callback('Check token fail\n' + checkTokenError);
                } else {
                    callback(null, checkTokenResult.id);
                }
            });
        },
        (userId, callback) => {
            if(userId == 1 || userId == 2) {
                scheduleBoardValidity.singleDataCheck(scheduleBoardId, (deleteCheckError, deleteCheckResult) => {
                    if(deleteCheckError) {
                        res.status(400).send({
                            stat : 'Fail',
                            title : 'Delete check fail',
                            contents : deleteCheckError
                        });

                        callback('Delete check fail\n' + deleteCheckError);
                    } else {
                        callback(null, userId);
                    }
                });
            } else {
                res.status(400).send({
                    stat : 'Fail',
                    title : 'Not authorized user',
                    content : 'You don\'t have authorize for this board'
                });
            }
        },
        (userId, callback) => {
            awsRds.getConnection((connectingRDSError, connectingRDSResult) => {
                if(connectingRDSError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Connecting RDS fail',
                        contents : connectingRDSError
                    });

                    callback('Connecting RDS fail\n'+ connectingRDSError);
                } else {
                    callback(null, connectingRDSResult, userId);
                }
            });
        },
        (connection, userId, callback) => {
            let deleteScheduleBoardDataParameter = {
                id : scheduleBoardId,
                userId : userId
            }

            let deleteScheduleBoardDataQuery = mybatis.mappingSQLStatement('schedule_boards', 'delete', 'deleteScheduleBoardData', deleteScheduleBoardDataParameter);

            connection.query(deleteScheduleBoardDataQuery, (deleteScheduleBoardDataQueryError, deleteScheduleBoardDataQueryResult) => {
                connection.release();
                
                if(deleteScheduleBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Delete schedule board data query fail',
                        contents : deleteScheduleBoardDataQueryError
                    });

                    callback('Delete schedule board data query fail\n' + deleteScheduleBoardDataQueryError);
                } else if(deleteScheduleBoardDataQueryResult.affectedRows == 0) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Unsuspected fail',
                        contents : 'Please ask to server admin'
                    });

                    callback('Unsuspected fail\nPlease ask to server admin');
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Delete schedule board success',
                        contents : 'Delete schedule board task success',
                    });

                    callback(null, 'Delete schedule board success\nDelete schedule board task success');
                }
            });
        }
    ];

    async.waterfall(scheduleBoardsDeleteTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Schedule-boards delete task error\n' + asyncError);
        else console.log('Async Success : Schedule-boards delete task success\n' + asyncResult);
    });
});

module.exports = router;