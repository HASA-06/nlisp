const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const historyBoardsValidity = require('../../private_modules/validitys/history_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /history-boards/create is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;

    let historyBoardDatas = {
        title : req.body.title,
        date : req.body.date
    };

    historyBoardDatas.count = Object.keys(historyBoardDatas).length;
    historyBoardDatas.keys = ["title", "date"];

    let historyBoardsCreateTask = [
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
                historyBoardsValidity.arrayDataCheck(historyBoardDatas, (createCheckError, createCheckResult) => {
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

                callback('Not authorized user\nYou don\'t have authorize for this board');
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
            let setHistoryBoardDatasParameter = {
                id : userId,
                title : historyBoardDatas.title,
                date : historyBoardDatas.date
            };

            let setHistoryBoardDatasQuery = mybatis.mappingSQLStatement('history_boards', 'create', 'setHistoryBoardDatas', setHistoryBoardDatasParameter);

            connection.query(setHistoryBoardDatasQuery, (setHistoryBoardDatasQueryError, setHistoryBoardDatasQueryResult) => {
                connection.release();

                if(setHistoryBoardDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set history board datas query fail',
                        contents : setHistoryBoardDatasQueryError
                    });

                    callback('Set history board datas query fail\n' + setHistoryBoardDatasQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Create history board success',
                        contents : 'Create history board task success'
                    });

                    callback(null, 'Create history board success\nCreate history board task success');
                }
            });
        }
    ];

    async.waterfall(historyBoardsCreateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : History-boards create task error\n' + asyncError);
        else console.log('Async Success : History-boards create task success\n' + asyncResult);
    });
});

module.exports = router;