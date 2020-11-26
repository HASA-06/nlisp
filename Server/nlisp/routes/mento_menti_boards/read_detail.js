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
    let mentoMentiBoardId = req.query.mentoMentiBoardId;

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
            let getMentoMentiBoardDataByIdParameter = {
                mentoMentiBoardId : mentoMentiBoardId
            };

            let getMentoMentiBoardDataByIdQuery = mybatis.mappingSQLStatement('mento_menti_boards', 'read_detail', 'getMentoMentiBoardDataById', getMentoMentiBoardDataByIdParameter);

            connection.query(getMentoMentiBoardDataByIdQuery, (getMentoMentiBoardDataByIdQueryError, getMentoMentiBoardDataByIdQueryResult) => {
                connection.release();

                if(getMentoMentiBoardDataByIdQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get mento-menti board datas more query fail',
                        contents : getMentoMentiBoardDataByIdQueryError
                    });

                    callback('Get mento-menti board datas more query fail\n' + getMentoMentiBoardDataByIdQueryError);
                } else if(getMentoMentiBoardDataByIdQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No bulletin board datas'
                    });

                    callback(null, 'No data\nNo bulletin board datas');
                } else {
                    boardUser.check(getMentoMentiBoardDataByIdQueryResult, userId, (boardUserCheckResult) => {
                        res.status(200).send({
                            stat : 'Success',
                            title : 'Read bulletin board more success',
                            contnets : 'Read bulletin board more task success, please check data',
                            mentoMentiBoards : boardUserCheckResult
                        });
    
                        callback(null, 'Read mento-menti board success\nGet bulletin board datas more task success, please check data');
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