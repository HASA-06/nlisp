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
        title : 'URL /users/tokens/re-issue is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;

    let usersTokensReIssueTask = [
        (callback) => {
            awsRds.getConnection((connectingRDSError, connectingRDSResult) => {
                if(connectingRDSError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Connecting RDS fail',
                        contents : connectingRDSError
                    });
    
                    callback('Connecting RDS fail\n'+ connectingRDSError);
                } else {
                    callback(null, connectingRDSResult);
                }
            });
        },
        (connection, callback) => {
            let getUserIdParameter = {
                token : userToken
            };

            let getUserIdQuery = mybatis.mappingSQLStatement('users/tokens', 're_issue', 'getUserId', getUserIdParameter);

            connection.query(getUserIdQuery, (getUserIdQueryError, getUserIdQueryResult) => {
                if(getUserIdQueryError) {
                    connection.release();

                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get user id query fail',
                        contents : getUserIdQueryError
                    });

                    callback('Get user id query fail\n' + getUserIdQueryError);
                } else if(getUserIdQueryResult.length == 0) {
                    connection.release();

                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Get user id query fail',
                        contents : 'No user with this token'
                    });

                    callback('Get user id query fail\nNo user with token value');
                } else {
                    callback(null, connection, getUserIdQueryResult[0]['id']);
                }
            });
        },
        (connection, userId, callback) => {
            jwt.createToken(userId, (createTokenError, createTokenResult) => {
                if(createTokenError) {
                    connection.release();

                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Create token fail',
                        contents: createTokenError
                    });

                    callback('Create token fail\n' + createTokenError)
                } else {
                    callback(null, connection, userId, createTokenResult);
                }
            });
        },
        (connection, userId, newToken, callback) => {
            let setUserTokenParameter = {
                id : userId,
                token : newToken
            };

            let setUserTokenQuery = mybatis.mappingSQLStatement('users/tokens', 're_issue', 'setUserToken', setUserTokenParameter);

            connection.query(setUserTokenQuery, (setUserTokenQueryError, setUserTokenQueryResult) => {
                connection.release();

                if(setUserTokenQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set user token query fail',
                        contents : setUserTokenQueryError
                    });

                    callback('Set user token query fail\n' + setUserTokenQueryError);
                } else if(setUserTokenQueryResult.affectedRows != 1) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set user token query fail',
                        contents : 'Not updated user token, please ask to server admin'
                    });

                    callback('Set user token query fail\nNot updated user token, please ask to server admin');
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Re-issue user token success',
                        contents : 'New user token is saved, please check data',
                        token : newToken
                    });

                    callback(null, 'Re-issue user token success\nNew user token is saved, please check data');
                }
            });
        }
    ];

    async.waterfall(usersTokensReIssueTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Users tokens re-issue task error\n' + asyncError);
        else console.log('Async Success : Users tokens re-issue task success\n' + asyncResult);
    });
});

module.exports = router;