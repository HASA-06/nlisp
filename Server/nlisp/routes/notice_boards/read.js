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
    let lastNoticeBoardId = req.query.lastNoticeBoardId;

    let noticeBoardsReadCommonTask = [
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

    let noticeBoardsReadFirstTask = [
        (connection, userId, callback) => {
            let getNoticeBoardDatasFirstParameter = null;

            let getNoticeBoardDatasFirstQuery = mybatis.mappingSQLStatement('notice_boards', 'read', 'getNoticeBoardDatasFirst', getNoticeBoardDatasFirstParameter);

            connection.query(getNoticeBoardDatasFirstQuery, (getNoticeBoardDatasFirstQueryError, getNoticeBoardDatasFirstQueryResult) => {
                connection.release();
                
                if(getNoticeBoardDatasFirstQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get notice board datas first query fail',
                        contents : getNoticeBoardDatasFirstQueryError
                    });

                    callback('Get notice board datas first query fail\n' + getNoticeBoardDatasFirstQueryError);
                } else if(getNoticeBoardDatasFirstQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No notice board datas'
                    });

                    callback(null, 'No data\nNo notice board datas');
                } else {
                    boardUser.check(getNoticeBoardDatasFirstQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read notice board fist success',
                            contnets : 'Read notice board first task success, please check data',
                            noticeBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read notice board success\nGet notice board datas first task success, please check data');
                    });
                } 
            });
        }
    ];

    let noticeBoardsReadMoreTask = [
        (connection, userId, callback) => {
            let getNoticeBoardDatasMoreParameter = {
                lastNoticeBoardId : lastNoticeBoardId
            };

            let getNoticeBoardDatasMoreQuery = mybatis.mappingSQLStatement('notice_boards', 'read', 'getNoticeBoardDatasMore', getNoticeBoardDatasMoreParameter);

            connection.query(getNoticeBoardDatasMoreQuery, (getNoticeBoardDatasMoreQueryError, getNoticeBoardDatasMoreQueryResult) => {
                connection.release();

                if(getNoticeBoardDatasMoreQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get notice board datas more query fail',
                        contents : getNoticeBoardDatasMoreQueryError
                    });

                    callback('Get notice board datas more query fail\n' + getNoticeBoardDatasMoreQueryError);
                } else if(getNoticeBoardDatasMoreQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No notice board datas'
                    });

                    callback(null, 'No data\nNo notice board datas');
                } else {
                    boardUser.check(getNoticeBoardDatasMoreQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read bulletin board more success',
                            contnets : 'Read notice board more task success, please check data',
                            noticeBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read notice board success\nGet notice board datas more task success, please check data');
                    });
                }
            });
        }
    ];

    taskUnion.doubleTask(lastNoticeBoardId, noticeBoardsReadCommonTask, noticeBoardsReadMoreTask, noticeBoardsReadFirstTask)
    .then(noticeBoardsReadTask => {
        async.waterfall(noticeBoardsReadTask, (asyncError, asyncResult) => {
            if(asyncError) console.log('Async Fail : Notice-boards read task error\n' + asyncError);
            else console.log('Async Success : Notice-boards read task success\n' + asyncResult);
        });
    });
});

module.exports = router;