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
    let noticeBoardId = req.query.noticeBoardId;

    let bulletinBoardsReadTask = [
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
            let getNoticeBoardDataParameter = {
                noticeBoardId : noticeBoardId
            };

            let getNoticeBoardDataQuery = mybatis.mappingSQLStatement('notice_boards', 'read_detail', 'getNoticeBoardData', getNoticeBoardDataParameter);

            connection.query(getNoticeBoardDataQuery, (getNoticeBoardDataQueryError, getNoticeBoardDataQueryResult) => {
                connection.release();

                if(getNoticeBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get notice board datas more query fail',
                        contents : getNoticeBoardDataQueryError
                    });

                    callback('Get notice board datas more query fail\n' + getNoticeBoardDataQueryError);
                } else if(getNoticeBoardDataQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No notice board datas'
                    });

                    callback(null, 'No data\nNo notice board datas');
                } else {
                    boardUser.check(getNoticeBoardDataQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read bulletin board more success',
                            contnets : 'Read bulletin board more task success, please check data',
                            noticeBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read notice board success\nGet notice board datas more task success, please check data');
                    });
                }
            });
        }
    ];

    async.waterfall(bulletinBoardsReadTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Bulletin-boards read task error\n' + asyncError);
        else console.log('Async Success : Bulletin-boards read task success\n' + asyncResult);
    });
});

module.exports = router;