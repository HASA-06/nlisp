const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../../private_modules/validitys/token');
const awsRds = require('../../../private_modules/databases/aws_rds');
const mybatis = require('../../../private_modules/databases/mybatis');
const jwt = require('../../../private_modules/jwt');

router.get('/', (req, res) => {
    let userToken = req.headers.token;

    let usersAccountsInfoTask = [
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
            let getUserDatasParameter = {
                id : userId
            };

            let getUserDatasQuery = mybatis.mappingSQLStatement('users/accounts', 'info', 'getUserDatas', getUserDatasParameter);

            connection.query(getUserDatasQuery, (getUserDatasQueryError, getUserDatasQueryResult) => {
                connection.release();

                if(getUserDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get user datas query fail',
                        contents : getUserDatasQueryError
                    });

                    callback('Get user datas query fail\n' + getUserDatasQueryError);
                } else {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'Get user info success',
                        contents : 'Get user info task success, please check data',
                        userData : getUserDatasQueryResult[0]
                    });

                    callback(null, 'Get user info success\nGet user info task success, please check data')
                }
            });
        }
    ];

    async.waterfall(usersAccountsInfoTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Users accounts info task error\n' + asyncError);
        else console.log('Async Success : Users accounts info task success\n' + asyncResult);
    });
});

module.exports = router;