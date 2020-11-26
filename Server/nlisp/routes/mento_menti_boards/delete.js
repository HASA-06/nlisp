const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');
const mentoMentiBoardsValidity = require('../../private_modules/validitys/mento_menti_boards');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /mento-menti-boards/delete is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;

    let mentoMentiBoardDatas = {
        id : req.body.id,
        title : req.body.title,
        content : req.body.content,
        userId : req.body.userId
    };

    mentoMentiBoardDatas.count = Object.keys(mentoMentiBoardDatas).length;
    mentoMentiBoardDatas.keys = ["id", "title", "content", "userId"];

    let mentoMentiBoardsDeleteTask = [
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
            if(userId != mentoMentiBoardDatas.userId) {
                res.status(400).send({
                    stat : 'Fail',
                    title : 'Not authorized user',
                    content : 'You don\'t have authorize for this board'
                });

                callback('Not authorized user\nYou don\'t have authorize for this board');
            } else {
                mentoMentiBoardsValidity.arrayDataCheck(mentoMentiBoardDatas, (arrayDataCheckError, arrayDataCheckResult) => {
                    if(arrayDataCheckError) {
                        res.status(400).send({
                            stat : 'Fail',
                            title : 'Mento menti update validity check fail',
                            contents : arrayDataCheckError
                        });

                        callback('Mento menti update validity check fail\n' + arrayDataCheckError);
                    } else {
                        callback(null, userId);
                    }
                });
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
            let deleteMentoMentiBoardDataParameter = {
                id : mentoMentiBoardDatas.id,
                userId : mentoMentiBoardDatas.userId
            };

            let deleteMentoMentiBoardDataQuery = mybatis.mappingSQLStatement('mento_menti_boards', 'delete', 'deleteMentoMentiBoardData', deleteMentoMentiBoardDataParameter);

            connection.query(deleteMentoMentiBoardDataQuery, (deleteMentoMentiBoardDataQueryError, deleteMentoMentiBoardDataQueryResult) => {
                connection.release();
                
                if(deleteMentoMentiBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Delete mento-menti board data query fail',
                        contents : deleteMentoMentiBoardDataQueryError
                    });

                    callback('Delete mento-menti board data query fail\n' + deleteMentoMentiBoardDataQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Delete mento-menti board data success',
                        contents : 'Delete mento-menti board data task success',
                    });

                    callback(null, 'Delete mento-menti board data success\Delete mento-menti board data task success');
                }
            });
        }
    ];

    async.waterfall(mentoMentiBoardsDeleteTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Mento-menti-boards delete task error\n' + asyncError);
        else console.log('Async Success : Mento-menti-boards delete task success\n' + asyncResult);
    });
})

module.exports = router;