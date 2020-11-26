const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');
const boardUser = require('../../private_modules/board_user');

router.get('/', (req, res) => {
    let userToken = req.headers.token;

    let qnaBoardsReadAskTask = [
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
            } else {
                res.status(400).send({
                    stat : 'Fail',
                    title : 'Not authorized user',
                    content : 'You don\'t have authorize for this board'
                });

                callback('Not authorized user\nYou don\'t have authorize for this board');
            }
        },
        (connection, userId, callback) => {
            let getAskDatasParameter = null;

            let getAskDatasQuery = mybatis.mappingSQLStatement('qna_boards', 'read_ask', 'getAskDatas', getAskDatasParameter);

            connection.query(getAskDatasQuery, (getAskDatasQueryError, getAskDatasQueryResult) => {
                connection.release();
                
                if(getAskDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get ask datas query fail',
                        contents : getAskDatasQueryError
                    });

                    callback('Get ask datas query fail\n' + getAskDatasQueryError);
                } else {
                    boardUser.check(getAskDatasQueryResult, userId, (boardUserResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read ask datas success',
                            contents : 'Read ask datas task success, please check data',
                            readAsk : boardUserResult
                        });

                        callback('Read ask datas success\nRead ask datas task success, please check data');
                    });
                }
            });
        }
    ];

    async.waterfall(qnaBoardsReadAskTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Qna-boards read ask task error\n' + asyncError);
        else console.log('Async Success : Qna-boards read ask task success\n' + asyncResult);
    });
});

module.exports = router;