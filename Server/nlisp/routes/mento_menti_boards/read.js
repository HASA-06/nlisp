const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');
const taskUnion = require('../../private_modules/task_union');

router.get('/', (req, res) => {
    let userToken = req.headers.token;
    let lastMentoMentiBoardId = req.query.lastMentoMentiBoardId;
    let mentoMentiBoardUserId = req.query.mentoMentiBoardUserId;

    let mentoMentiBoardsReadCommonTask = [
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

    let mentoMentiBoardsReadFirstTask = [
        (connection, userId, callback) => {
            let getMentoMentiBoardDatasFirstParameter = {
                userId : mentoMentiBoardUserId
            };

            let getMentoMentiBoardDatasFirstQuery = mybatis.mappingSQLStatement('mento_menti_boards', 'read', 'getMentoMentiBoardDatasFirst', getMentoMentiBoardDatasFirstParameter);

            connection.query(getMentoMentiBoardDatasFirstQuery, (getMentoMentiBoardDatasFirstQueryError, getMentoMentiBoardDatasFirstQueryResult) => {
                connection.release();
                
                if(getMentoMentiBoardDatasFirstQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get mento-menti board datas first query fail',
                        content : getMentoMentiBoardDatasFirstQueryError
                    });

                    callback('Get mento-menti board datas first query fail\n' + getMentoMentiBoardDatasFirstQueryError);
                } else if(getMentoMentiBoardDatasFirstQueryResult.length == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No mento-menti board datas'
                    });

                    callback(null, 'No data\nNo mento-menti board datas');
                } else {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'Read mento-menti board first success',
                        content : 'Read mento-menti board first task success, please check data',
                        mentoMentiBoards : getMentoMentiBoardDatasFirstQueryResult
                    });
                }
            });
        }
    ];

    let mentoMentiBoardsReadMoreTask = [
        (connection, userId, callback) => {
            let getMentoMentiBoardDatasMoreParameter = {
                userId : mentoMentiBoardUserId,
                lastMentoMentiBoardId : lastMentoMentiBoardId
            };

            let getMentoMentiBoardDatasMoreQuery = mybatis.mappingSQLStatement('mento_menti_boards', 'read', 'getMentoMentiBoardDatasMore', getMentoMentiBoardDatasMoreParameter);
            
            connection.query(getMentoMentiBoardDatasMoreQuery, (getMentoMentiBoardDatasMoreQueryError, getMentoMentiBoardDatasMoreQueryResult) => {
                connection.release();
                
                if(getMentoMentiBoardDatasMoreQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get mento-menti board datas more query fail',
                        contents : getMentoMentiBoardDatasMoreQueryError
                    });

                    callback('Get mento-menti board datas more query fail\n' + getMentoMentiBoardDatasMoreQueryError);
                } else if(getMentoMentiBoardDatasMoreQueryResult == 0) {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'No data',
                        contents : 'No bulletin board datas'
                    });

                    callback('No data\nNo bulletin board datas');
                } else {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'Read mento-menti board more success',
                        contnets : 'Read mento-menti board more task success, please check data',
                        mentoMentiBoards : getMentoMentiBoardDatasMoreQueryResult
                    });

                    callback(null, 'Read mento-menti board success\nGet mento-menti board datas more task success, please check data');
                }
            });
        }
    ];

    taskUnion.doubleTask(lastMentoMentiBoardId, mentoMentiBoardsReadCommonTask, mentoMentiBoardsReadMoreTask, mentoMentiBoardsReadFirstTask)
    .then(mentoMentiBoardsReadTask => {
        async.waterfall(mentoMentiBoardsReadTask, (asyncError, asyncResult) => {
            if(asyncError) console.log('Async Fail : Mento-menti-boards read task error\n' + asyncError);
            else console.log('Async Success : Mento-menti-boards read task success\n' + asyncResult);
        });
    });
});

module.exports = router;