const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const noticeBoardValidity = require('../../private_modules/validitys/notice_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /notice-boards/create is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;

    let noticeBoardDatas = {
        title : req.body.title,
        content : req.body.content,
    };

    noticeBoardDatas.count = Object.keys(noticeBoardDatas).length;
    noticeBoardDatas.keys = ["title", "content"];

    let noticeBoardsCreateTask = [
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
                noticeBoardValidity.arrayDataCheck(noticeBoardDatas, (arrayDataCheckError, arrayDataCheckResult) => {
                    if(arrayDataCheckError) {
                        res.status(400).send({
                            stat : 'Fail',
                            title : 'Create check fail',
                            content : arrayDataCheckError
                        });
    
                        callback('Create check fail\n' + arrayDataCheckError);
                    } else {
                        callback(null, userId);
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
            let setNoticeBoardDatasParameter = {
                id : userId,
                title : noticeBoardDatas.title,
                content : noticeBoardDatas.content
            };

            let setNoticeBoardDatasQuery = mybatis.mappingSQLStatement('notice_boards', 'create', 'setNoticeBoardDatas', setNoticeBoardDatasParameter);

            connection.query(setNoticeBoardDatasQuery, (setNoticeBoardDatasQueryError, setNoticeBoardDatasQueryResult) => {
                connection.release();

                if(setNoticeBoardDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set notice board datas query fail',
                        contents : setNoticeBoardDatasQueryError
                    });

                    callback('Set notice board datas query fail\n' + setNoticeBoardDatasQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Create notice board success',
                        contents : 'Create notice board task success'
                    });

                    callback(null, 'Create notice board success\nCreate notice board task success');
                }
            });
        }
    ];

    async.waterfall(noticeBoardsCreateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Notice-boards create task error\n' + asyncError);
        else console.log('Async Success : Notice-boards create task success\n' + asyncResult);
    });
});

module.exports = router;