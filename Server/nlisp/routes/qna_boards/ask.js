const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const qnaBoardsValidity = require('../../private_modules/validitys/qna_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /qna-boards/create is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;

    let qnaBoardDatas = {
        title : req.body.title,
        content : req.body.content,
    };

    qnaBoardDatas.count = Object.keys(qnaBoardDatas).length;
    qnaBoardDatas.keys = ["title", "content"];

    let qnaBoardsCreateTask = [
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
            qnaBoardsValidity.arrayDataCheck(qnaBoardDatas, (createCheckError, createCheckResult) => {
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
            let setQnaBoardDatasParameter = {
                id : userId,
                title : qnaBoardDatas.title,
                content : qnaBoardDatas.content
            };

            let setQnaBoardDatasQuery = mybatis.mappingSQLStatement('qna_boards', 'ask', 'setQnaBoardDatas', setQnaBoardDatasParameter);

            connection.query(setQnaBoardDatasQuery, (setQnaBoardDatasQueryError, setQnaBoardDatasQueryResult) => {
                connection.release();

                if(setQnaBoardDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set qna board datas query fail',
                        contents : setQnaBoardDatasQueryError
                    });

                    callback('Set qna board datas query fail\n' + setQnaBoardDatasQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Create qna board success',
                        contents : 'Create qna board task success'
                    });

                    callback(null, 'Create qna board success\nCreate qna board task success');
                }
            });
        }
    ];

    async.waterfall(qnaBoardsCreateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : qna-boards create task error\n' + asyncError);
        else console.log('Async Success : qna-boards create task success\n' + asyncResult);
    });
});

module.exports = router;