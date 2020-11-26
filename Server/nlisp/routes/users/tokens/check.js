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
        title : 'URL /users/tokens/check is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;

    let usersTokensCheckTask = [
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
            let getUserJWTTokenParameter = {
                id : userId,
                token : userToken
            };
    
            let getUserJWTTokenQuery = mybatis.mappingSQLStatement('users/tokens', 'check', 'getUserJWTToken', getUserJWTTokenParameter);
    
            connection.query(getUserJWTTokenQuery, (getUserJWTTokenQueryError, getUserJWTTokenQueryResult) => {
                connection.release();
    
                if(getUserJWTTokenQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get user jwt token query fail',
                        content : getUserJWTTokenQueryError
                    });
    
                    callback('Get user jwt token query fail\n' + getUserJWTTokenQueryError);
                } else if(getUserJWTTokenQueryResult.length == 1) {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Check token success',
                        contents : 'This token is effective',
                        id : getUserJWTTokenQueryResult[0].id,
                        token : getUserJWTTokenQueryResult[0].token,
                        name : getUserJWTTokenQueryResult[0].name,
                        email : getUserJWTTokenQueryResult[0].email,
                        imageURL : getUserJWTTokenQueryResult[0].imageURL
                    });
    
                    callback(null, 'Check token success\nThis token is effective');
                } else {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'No user with this token',
                        contents : 'Please check user token'
                    });
    
                    callback('No user with this token\nPlease check user token');
                }
            });
        }
    ];
    
    async.waterfall(usersTokensCheckTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Users tokens check task error\n' + asyncError);
        else console.log('Async Success : Users tokens check task success\n' + asyncResult);
    });
});

module.exports = router;