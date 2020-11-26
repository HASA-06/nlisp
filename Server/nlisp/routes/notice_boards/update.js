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
        title : 'URL /notice-boards/update is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    
    let noticeBoardDatas = {
        id : req.body.id,
        title : req.body.title,
        content : req.body.content
    };

    noticeBoardDatas.count = Object.keys(noticeBoardDatas).length;
    noticeBoardDatas.keys = ["id", "title", "content"];

    let noticeBoardsUpdateTask = [
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
            noticeBoardValidity.arrayDataCheck(noticeBoardDatas, (updateCheckError, updateCheckResult) => {
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
            let setNoticeBoardDataParameter = {
                id : noticeBoardDatas.id,
                title : noticeBoardDatas.title,
                content : noticeBoardDatas.content,
                userId : userId
            };

            let setNoticeBoardDataQuery = mybatis.mappingSQLStatement('notice_boards', 'update', 'setNoticeBoardData', setNoticeBoardDataParameter);

            connection.query(setNoticeBoardDataQuery, (setNoticeBoardDataQueryError, setNoticeBoardDataQueryResult) => {
                connection.release();

                if(setNoticeBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set notice board data query fail',
                        contents : setNoticeBoardDataQueryError
                    });

                    callback('Set notice board data query fail\n' + setNoticeBoardDataQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Update notice board data success',
                        contents : 'Update notice board data task success',
                        noticeBoardData : setNoticeBoardDataParameter
                    });

                    callback(null, 'Update notice board data success\nUpdate notice board data task success');
                }
            });
        }
    ];

    async.waterfall(noticeBoardsUpdateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : notice-boards update task error\n' + asyncError);
        else console.log('Async Success : notice-boards update task success\n' + asyncResult);
    });
});

module.exports = router;