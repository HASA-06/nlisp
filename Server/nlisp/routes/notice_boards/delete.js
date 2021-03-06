const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const noticeBoardValidity = require('../../private_modules/validitys/notice_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    let noticeBoardId = req.body.noticeBoardId;

    let noticeBoardsDeleteTask = [
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
            noticeBoardValidity.singleDataCheck(noticeBoardId, (deleteCheckError, deleteCheckResult) => {
                if(deleteCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Delete check fail',
                        contents : deleteCheckError
                    });

                    callback('Delete check fail\n' + deleteCheckError);
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
            let deleteNoticeBoardDataParameter = {
                id : noticeBoardId,
                userId : userId
            }

            let deleteNoticeBoardDataQuery = mybatis.mappingSQLStatement('notice_boards', 'delete', 'deleteNoticeBoardData', deleteNoticeBoardDataParameter);

            connection.query(deleteNoticeBoardDataQuery, (deleteNoticeBoardDataQueryError, deleteNoticeBoardDataQueryResult) => {
                connection.release();
                
                if(deleteNoticeBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Delete notice board data query fail',
                        contents : deleteNoticeBoardDataQueryError
                    });

                    callback('Delete notice board data query fail\n' + deleteNoticeBoardDataQueryError);
                } else if(deleteNoticeBoardDataQueryResult.affectedRows == 0) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Unsuspected fail',
                        contents : 'Please ask to server admin'
                    });

                    callback('Unsuspected fail\nPlease ask to server admin');
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Delete notice board success',
                        contents : 'Delete notice board task success',
                    });

                    callback(null, 'Delete notice board success\nDelete notice board task success');
                }
            });
        }
    ];

    async.waterfall(noticeBoardsDeleteTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : notice-boards delete task error\n' + asyncError);
        else console.log('Async Success : notice-boards delete task success\n' + asyncResult);
    });
});

module.exports = router;