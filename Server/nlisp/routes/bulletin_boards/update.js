const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const bulletinBoardValidity = require('../../private_modules/validitys/bulletin_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /bulletin-boards/update is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    
    let bulletinBoardDatas = {
        id : req.body.id,
        title : req.body.title,
        content : req.body.content
    };

    bulletinBoardDatas.count = Object.keys(bulletinBoardDatas).length;
    bulletinBoardDatas.keys = ["id", "title", "content"];

    let bulletinBoardsUpdateTask = [
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
            bulletinBoardValidity.updateCheck(bulletinBoardDatas, (updateCheckError, updateCheckResult) => {
                if(updateCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Update check fail',
                        contents : updateCheckError
                    });

                    callback('Update check fail\n' + updateCheckError);
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
            let setBulletinBoardDataParameter = {
                id : bulletinBoardDatas.id,
                title : bulletinBoardDatas.title,
                content : bulletinBoardDatas.content,
                userId : userId
            };

            let setBulletinBoardDataQuery = mybatis.mappingSQLStatement('bulletin_boards', 'update', 'setBulletinBoardData', setBulletinBoardDataParameter);

            connection.query(setBulletinBoardDataQuery, (setBulletinBoardDataQueryError, setBulletinBoardDataQueryResult) => {
                connection.release();

                if(setBulletinBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set bulletin board data query fail',
                        contents : setBulletinBoardDataQueryError
                    });

                    callback('Set bulletin board data query fail\n' + setBulletinBoardDataQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Update bulletin board data success',
                        contents : 'Update bulletin board data task success',
                        bulletinBoardData : setBulletinBoardDataParameter
                    });

                    callback(null, 'Update bulletin board data success\nUpdate bulletin board data task success');
                }
            });
        }
    ];

    async.waterfall(bulletinBoardsUpdateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Bulletin-boards update task error\n' + asyncError);
        else console.log('Async Success : Bulletin-boards update task success\n' + asyncResult);
    });
});

module.exports = router;