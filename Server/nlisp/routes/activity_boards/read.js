const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');
const taskUnion = require('../../private_modules/task_union');
const boardUser = require('../../private_modules/board_user');

router.get('/', (req, res) => {
    let userToken = req.headers.token;
    let lastActivityBoardId = req.query.lastActivityBoardId;

    let activityBoardsReadCommonTask = [
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

    let activityBoardsReadFirstTask = [
        (connection, userId, callback) => {
            let getActivityBoardDatasFirstParameter = null;

            let getActivityBoardDatasFirstQuery = mybatis.mappingSQLStatement('activity_boards', 'read', 'getActivityBoardDatasFirst', getActivityBoardDatasFirstParameter);

            connection.query(getActivityBoardDatasFirstQuery, (getActivityBoardDatasFirstQueryError, getActivityBoardDatasFirstQueryResult) => {
                connection.release();
                
                if(getActivityBoardDatasFirstQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get Activity board datas first query fail',
                        contents : getActivityBoardDatasFirstQueryError
                    });

                    callback('Get Activity board datas first query fail\n' + getActivityBoardDatasFirstQueryError);
                } else if(getActivityBoardDatasFirstQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No Activity board datas'
                    });

                    callback(null, 'No data\nNo Activity board datas');
                } else {
                    boardUser.check(getActivityBoardDatasFirstQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read Activity board fist success',
                            contnets : 'Read Activity board first task success, please check data',
                            bulletinBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read Activity board success\nGet Activity board datas first task success, please check data');
                    });
                } 
            });
        }
    ];

    let activityBoardsReadMoreTask = [
        (connection, userId, callback) => {
            let getActivityBoardDatasMoreParameter = {
                lastActivityBoardId : lastActivityBoardId
            };

            let getActivityBoardDatasMoreQuery = mybatis.mappingSQLStatement('activity_boards', 'read', 'getActivityBoardDatasMore', getActivityBoardDatasMoreParameter);

            connection.query(getActivityBoardDatasMoreQuery, (getActivityBoardDatasMoreQueryError, getActivityBoardDatasMoreQueryResult) => {
                connection.release();
                
                if(getActivityBoardDatasMoreQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get Activity board datas more query fail',
                        contents : getActivityBoardDatasMoreQueryError
                    });

                    callback('Get Activity board datas more query fail\n' + getActivityBoardDatasMoreQueryError);
                } else if(getActivityBoardDatasMoreQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No Activity board datas'
                    });

                    callback(null, 'No data\nNo Activity board datas');
                } else {
                    boardUser.check(getActivityBoardDatasMoreQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read Activity board more success',
                            contnets : 'Read Activity board more task success, please check data',
                            bulletinBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read Activity board success\nGet Activity board datas more task success, please check data');
                    });
                }
            });
        }
    ];

    taskUnion.doubleTask(lastActivityBoardId, activityBoardsReadCommonTask, activityBoardsReadMoreTask, activityBoardsReadFirstTask)
    .then(activityBoardsReadTask => {
        async.waterfall(activityBoardsReadTask, (asyncError, asyncResult) => {
            if(asyncError) console.log('Async Fail : Activity-boards read task error\n' + asyncError);
            else console.log('Async Success : Activity-boards read task success\n' + asyncResult);
        });
    })
});

module.exports = router;