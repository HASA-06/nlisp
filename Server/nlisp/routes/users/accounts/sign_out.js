const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../../private_modules/validitys/token');
const awsRds = require('../../../private_modules/databases/aws_rds');
const mybatis = require('../../../private_modules/databases/mybatis');
const jwt = require('../../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /users/accounts/sign-out is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;

    let usersAccountsSignOutTask = [
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
            let setUserTokenParameter = {
                id : userId,
                token : null
            };

            let setUserTokenQuery = mybatis.mappingSQLStatement('users/accounts', 'sign_out', 'setUserToken', setUserTokenParameter);

            connection.query(setUserTokenQuery, (setUserTokenQueryError, setUserTokenQueryResult) => {
                connection.release();

                if(setUserTokenQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set user token query fail',
                        contents : setUserTokenQueryError
                    });

                    callback('Set user token query fail\n' + setUserTokenQueryError);
                } else if(setUserTokenQueryResult.affectedRows == 1){
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Sign out success',
                        contents : 'Sign out task success'
                    });

                    callback(null, 'Sign out success\nSign out task success');
                } else {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Unsuspected fail',
                        content: 'Please ask to server admin'
                    });

                    callback('Unsuspected fail\nPlease ask to server admin');
                }
            })
        }
    ];

    async.waterfall(usersAccountsSignOutTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Users accounts sign-out task error\n' + asyncError);
        else console.log('Async Success : Users accounts sign-out task success\n' + asyncResult);
    });
});

module.exports = router;