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
        title : 'URL /mento-menti-boards/update is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;

    let mentoMentiBoardDatas = {
        id : req.body.id,
        title : req.body.title,
        content : req.body.content,
        userId : req.body.userId
    }

    mentoMentiBoardDatas.count = Object.keys(mentoMentiBoardDatas).length;
    mentoMentiBoardDatas.keys = ["id", "title", "content", "userId"];

    let mentoMentiBoardsUpdateTask = [
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
            let setMentoMentiBoardDatasParameter = {
                id : mentoMentiBoardDatas.id,
                title : mentoMentiBoardDatas.title,
                content : mentoMentiBoardDatas.content,
                userId : userId
            };

            let setMentoMentiBoardDatasQuery = mybatis.mappingSQLStatement('mento_menti_boards', 'update', 'setMentoMentiBoardDatas', setMentoMentiBoardDatasParameter);

            connection.query(setMentoMentiBoardDatasQuery, (setMentoMentiBoardDatasQueryError, setMentoMentiBoardDatasQueryResult) => {
                connection.release();
                
                if(setMentoMentiBoardDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set mento-menti board data query fail',
                        contents : setMentoMentiBoardDatasQueryError
                    });

                    callback('Set mento-menti board data query fail\n' + setMentoMentiBoardDatasQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Update mento-menti board data success',
                        contents : 'Update mento-menti board data task success',
                        bulletinBoardData : setMentoMentiBoardDatasParameter
                    });

                    callback(null, 'Update mento-menti board data success\nUpdate mento-menti board data task success');
                }
            });
        }
    ];

    async.waterfall(mentoMentiBoardsUpdateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Mento-menti-boards update task error\n' + asyncError);
        else console.log('Async Success : Mento-menti-boards update task success\n' + asyncResult);
    });
})

module.exports = router;