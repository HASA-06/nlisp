const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const scheduleBoardsValidity = require('../../private_modules/validitys/schedule_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /schedule-boards/create is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    let scheduleBoardDatas = {
        title : req.body.title,
        content : req.body.content,
        year : req.body.year,
        month : req.body.month,
        day : req.body.day,
        startTime : req.body.startTime,
        endTime : req.body.endTime
    };

    scheduleBoardDatas.count = Object.keys(scheduleBoardDatas).length;
    scheduleBoardDatas.keys = ["title", "content", "year", "month", "day", "startTime", "endTime"];

    let scheduleBoardsCreateTask = [
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
                scheduleBoardsValidity.arrayDataCheck(scheduleBoardDatas, (createCheckError, createCheckResult) => {
                    if(createCheckError) {
                        res.status(400).send({
                            stat : 'Fail',
                            title : 'Create check fail',
                            content : createCheckError
                        });
    
                        callback('Create check fail\n' + createCheckError);
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
            let setScheduleBoardDatasParameter = {
                id : userId,
                title : scheduleBoardDatas.title,
                content : scheduleBoardDatas.content,
                year : scheduleBoardDatas.year,
                month : scheduleBoardDatas.month,
                day : scheduleBoardDatas.day,
                startTime : scheduleBoardDatas.startTime,
                endTime : scheduleBoardDatas.endTime
            };

            let setScheduleBoardDatasQuery = mybatis.mappingSQLStatement('schedule_boards', 'create', 'setScheduleBoardDatas', setScheduleBoardDatasParameter);

            connection.query(setScheduleBoardDatasQuery, (setScheduleBoardDatasQueryError, setScheduleBoardDatasQueryResult) => {
                connection.release();

                if(setScheduleBoardDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set schedule board datas query fail',
                        contents : setScheduleBoardDatasQueryError
                    });

                    callback('Set schedule board datas query fail\n' + setScheduleBoardDatasQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Create schedule board success',
                        contents : 'Create schedule board task success'
                    });

                    callback(null, 'Create schedule board success\nCreate schedule board task success');
                }
            });
        }
    ];

    async.waterfall(scheduleBoardsCreateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : schedule-boards create task error\n' + asyncError);
        else console.log('Async Success : schedule-boards create task success\n' + asyncResult);
    });
});

module.exports = router;

module.exports = router;