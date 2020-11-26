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

    let qnaBoardsReadAnswerTask = [
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
        },
        (connection, userId, callback) => {
            let getAnswerDatasParameter = null;

            let getAnswerDatasQuery = mybatis.mappingSQLStatement('qna_boards', 'read_answer', 'getAnswerDatas', getAnswerDatasParameter);

            connection.query(getAnswerDatasQuery, (getAnswerDatasQueryError, getAnswerDatasQueryResult) => {
                connection.release();
                
                if(getAnswerDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get answer datas query fail',
                        contents : getAnswerDatasQueryError
                    });

                    callback('Get answer datas query fail\n' + getAnswerDatasQueryError);
                } else {
                    boardUser.check(getAnswerDatasQueryResult, userId, (boardUserResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read answer datas success',
                            contents : 'Read answer datas task success, please check data',
                            readAnswer : boardUserResult
                        });

                        callback('Read answer datas success\nRead answer datas task success, please check data');
                    });
                }
            });
        }
    ];

    async.waterfall(qnaBoardsReadAnswerTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Qna-boards read answer task error\n' + asyncError);
        else console.log('Async Success : Qna-boards read answer task success\n' + asyncResult);
    });
});

module.exports = router;