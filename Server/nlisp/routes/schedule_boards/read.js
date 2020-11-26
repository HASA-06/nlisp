const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');
const boardUser = require('../../private_modules/board_user');
const taskUnion = require('../../private_modules/task_union');

router.get('/', (req, res) => {
    let userToken = req.headers.token;
    let lastScheduleBoardId = req.query.lastScheduleBoardId;
    let scheduleMonth = req.query.scheduleMonth

    let scheduleBoardsReadCommonTask = [
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
        }
    ];

    let scheduleBoardsReadFirstTask = [
        (connection, userId, callback) => {
            let getScheduleBoardDatasParameter = {
                scheduleMonth : scheduleMonth
            };

            let getScheduleBoardDatasQuery = mybatis.mappingSQLStatement('schedule_boards', 'read', 'getScheduleBoardDatas', getScheduleBoardDatasParameter);

            connection.query(getScheduleBoardDatasQuery, (getScheduleBoardDatasQueryError, getScheduleBoardDatasQueryResult) => {
                connection.release();
                
                if(getScheduleBoardDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get schedule board datas first query fail',
                        contents : getScheduleBoardDatasQueryError
                    });

                    callback('Get schedule board datas first query fail\n' + getScheduleBoardDatasQueryError);
                } else if(getScheduleBoardDatasQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No schedule board datas'
                    });

                    callback(null, 'No data\nNo schedule board datas');
                } else {
                    boardUser.check(getScheduleBoardDatasQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read schedule board fist success',
                            contnets : 'Read schedule board first task success, please check data',
                            scheduleBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read schedule board success\nGet schedule board datas first task success, please check data');
                    });
                } 
            });
        }
    ];

    let scheduleBoardsReadMoreTask = [
        (connection, userId, callback) => {
            let getScheduleBoardDatasMoreParameter = {
                lastScheduleBoardId : lastScheduleBoardId
            };

            let getScheduleBoardDatasMoreQuery = mybatis.mappingSQLStatement('schedule_boards', 'read', 'getScheduleBoardDatasMore', getScheduleBoardDatasMoreParameter);

            connection.query(getScheduleBoardDatasMoreQuery, (getScheduleBoardDatasMoreQueryError, getScheduleBoardDatasMoreQueryResult) => {
                connection.release();

                if(getScheduleBoardDatasMoreQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get schedule board datas more query fail',
                        contents : getScheduleBoardDatasMoreQueryError
                    });

                    callback('Get schedule board datas more query fail\n' + getScheduleBoardDatasMoreQueryError);
                } else if(getScheduleBoardDatasMoreQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No schedule board datas'
                    });

                    callback(null, 'No data\nNo schedule board datas');
                } else {
                    boardUser.check(getScheduleBoardDatasMoreQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read schedule board more success',
                            contnets : 'Read schedule board more task success, please check data',
                            scheduleBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read schedule board success\nGet schedule board datas more task success, please check data');
                    });
                }
            });
        }
    ];

    taskUnion.doubleTask(lastScheduleBoardId, scheduleBoardsReadCommonTask, scheduleBoardsReadMoreTask, scheduleBoardsReadFirstTask)
    .then(scheduleBoardsReadTask => {
        async.waterfall(scheduleBoardsReadTask, (asyncError, asyncResult) => {
            if(asyncError) console.log('Async Fail : Schedule-boards read task error\n' + asyncError);
            else console.log('Async Success : Schedule-boards read task success\n' + asyncResult);
        });
    });
});

module.exports = router;