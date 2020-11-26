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

    let historyBoardsReadTask = [
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
            let getHistoryBoardDatasFirstParameter = null;

            let getHistoryBoardDatasFirstQuery = mybatis.mappingSQLStatement('history_boards', 'read', 'getHistoryBoardDatasFirst', getHistoryBoardDatasFirstParameter);

            connection.query(getHistoryBoardDatasFirstQuery, (getHistoryBoardDatasFirstQueryError, getHistoryBoardDatasFirstQueryResult) => {
                connection.release();
                
                if(getHistoryBoardDatasFirstQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get history board datas first query fail',
                        contents : getHistoryBoardDatasFirstQueryError
                    });

                    callback('Get history board datas first query fail\n' + getHistoryBoardDatasFirstQueryError);
                } else if(getHistoryBoardDatasFirstQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No history board datas'
                    });

                    callback(null, 'No data\nNo history board datas');
                } else {
                    boardUser.check(getHistoryBoardDatasFirstQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read history board fist success',
                            contnets : 'Read history board first task success, please check data',
                            historyBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read history board success\nGet history board datas first task success, please check data');
                    });
                } 
            });
        }
    ];

    async.waterfall(historyBoardsReadTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : History-boards read task error\n' + asyncError);
        else console.log('Async Success : History-boards read task success\n' + asyncResult);
    });
});

module.exports = router;