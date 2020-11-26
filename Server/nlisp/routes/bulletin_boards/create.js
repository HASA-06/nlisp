const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const bulletinBoardsValidity = require('../../private_modules/validitys/bulletin_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /bulletin-boards/create is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    let bulletinBoardDatas = {
        title : req.body.title,
        content : req.body.content,
    };

    bulletinBoardDatas.count = Object.keys(bulletinBoardDatas).length;
    bulletinBoardDatas.keys = ["title", "content"];

    let bulletinBoardsCreateTask = [
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
            bulletinBoardsValidity.createCheck(bulletinBoardDatas, (createCheckError, createCheckResult) => {
                if(createCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Create check fail',
                        content : createCheckError
                    });

                    callback('Create check fail\n' + createCheckError);
                } else {
                    callback(null, userId);
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
            let setBulletinBoardDatasParameter = {
                id : userId,
                title : bulletinBoardDatas.title,
                content : bulletinBoardDatas.content
            };

            let setBulletinBoardDatasQuery = mybatis.mappingSQLStatement('bulletin_boards', 'create', 'setBulletinBoardDatas', setBulletinBoardDatasParameter);

            connection.query(setBulletinBoardDatasQuery, (setBulletinBoardDatasQueryError, setBulletinBoardDatasQueryResult) => {
                connection.release();

                if(setBulletinBoardDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set bulletin board datas query fail',
                        contents : setBulletinBoardDatasQueryError
                    });

                    callback('Set bulletin board datas query fail\n' + setBulletinBoardDatasQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Create bulletin board success',
                        contents : 'Create bulletin board task success'
                    });

                    callback(null, 'Create bulletin board success\nCreate bulletin board task success');
                }
            });
        }
    ];

    async.waterfall(bulletinBoardsCreateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Bulletin-boards create task error\n' + asyncError);
        else console.log('Async Success : Bulletin-boards create task success\n' + asyncResult);
    });
});

module.exports = router;