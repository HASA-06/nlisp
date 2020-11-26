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
        title : 'URL /bulletin-boards/delete is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    let bulletinBoardId = req.body.bulletinBoardId;

    let bulletinBoardsDeleteTask = [
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
            bulletinBoardValidity.deleteCheck(bulletinBoardId, (deleteCheckError, deleteCheckResult) => {
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
            let deleteBulletinBoardDataParameter = {
                id : bulletinBoardId,
                userId : userId
            }

            let deleteBulletinBoardDataQuery = mybatis.mappingSQLStatement('bulletin_boards', 'delete', 'deleteBulletinBoardData', deleteBulletinBoardDataParameter);

            connection.query(deleteBulletinBoardDataQuery, (deleteBulletinBoardDataQueryError, deleteBulletinBoardDataQueryResult) => {
                connection.release();
                
                if(deleteBulletinBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Delete bulletin board data query fail',
                        contents : deleteBulletinBoardDataQueryError
                    });

                    callback('Delete bulletin board data query fail\n' + deleteBulletinBoardDataQueryError);
                } else if(deleteBulletinBoardDataQueryResult.affectedRows == 0) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Unsuspected fail',
                        contents : 'Please ask to server admin'
                    });

                    callback('Unsuspected fail\nPlease ask to server admin');
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Delete bulletin board success',
                        contents : 'Delete bulletin board task success',
                    });

                    callback(null, 'Delete bulletin board success\nDelete bulletin board task success');
                }
            });
        }
    ];

    async.waterfall(bulletinBoardsDeleteTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Bulletin-boards delete task error\n' + asyncError);
        else console.log('Async Success : Bulletin-boards delete task success\n' + asyncResult);
    });
});

module.exports = router;