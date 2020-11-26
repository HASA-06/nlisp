const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const qnaBoardValidity = require('../../private_modules/validitys/qna_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /qna-boards/delete is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    let qnaBoardId = req.body.qnaBoardId;

    let qnaBoardsDeleteTask = [
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
            qnaBoardValidity.singleDataCheck(qnaBoardId, (deleteCheckError, deleteCheckResult) => {
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
            let deleteQnaBoardDataParameter = {
                id : qnaBoardId,
                userId : userId
            }

            let deleteQnaBoardDataQuery = mybatis.mappingSQLStatement('qna_boards', 'delete', 'deleteQnaBoardData', deleteQnaBoardDataParameter);

            connection.query(deleteQnaBoardDataQuery, (deleteQnaBoardDataQueryError, deleteQnaBoardDataQueryResult) => {
                connection.release();
                
                if(deleteQnaBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Delete qna board data query fail',
                        contents : deleteQnaBoardDataQueryError
                    });

                    callback('Delete qna board data query fail\n' + deleteQnaBoardDataQueryError);
                } else if(deleteQnaBoardDataQueryResult.affectedRows == 0) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Unsuspected fail',
                        contents : 'Please ask to server admin'
                    });

                    callback('Unsuspected fail\nPlease ask to server admin');
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Delete qna board success',
                        contents : 'Delete qna board task success',
                    });

                    callback(null, 'Delete qna board success\nDelete qna board task success');
                }
            });
        }
    ];

    async.waterfall(qnaBoardsDeleteTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Qna-boards delete task error\n' + asyncError);
        else console.log('Async Success : Qna-boards delete task success\n' + asyncResult);
    });
});

module.exports = router;

module.exports = router;