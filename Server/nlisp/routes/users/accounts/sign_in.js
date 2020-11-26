const express = require('express');
const router = express.Router();
const async = require('async');

const accountValidity = require('../../../private_modules/validitys/accounts');
const encryption = require('../../../private_modules/encryption');
const awsRds = require('../../../private_modules/databases/aws_rds');
const mybatis = require('../../../private_modules/databases/mybatis');
const jwt = require('../../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /users/accounts/sign-in is connected'
    });
});

router.post('/', (req, res) => {
    let userDatas = {
        email : req.body.email,
        password : req.body.password
    };

    userDatas.count = Object.keys(userDatas).length;
    userDatas.keys = ['email', 'password'];

    let usersAccountsSignInTask = [
        (callback) => {
            accountValidity.signInCheck(userDatas, (signInCheckError, signInCheckResult) => {
                if(signInCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Sign in check fail',
                        contents : signInCheckError
                    });

                    callback('Sign in check fail\n' + signInCheckError);
                } else {
                    callback(null, signInCheckResult);
                }
            });
        },
        (signInCheckResult, callback) => {
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
            let getUserDatasParameter = {
                email : userDatas.email
            };

            let getUserDatasQuery = mybatis.mappingSQLStatement('users/accounts', 'sign_in', 'getUserDatas', getUserDatasParameter);
           
            connection.query(getUserDatasQuery, (getUserDatasQueryError, getUserDatasQueryResult) => {
                if(getUserDatasQueryError) {
                    connection.release();

                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get user password query fail',
                        contents : getUserDatasQueryError
                    });

                    callback('Get user password query fail\n' + getUserDatasQueryError);
                } else if(getUserDatasQueryResult.length == 0) {
                    connection.release();

                    res.status(400).send({
                        stat : 'Fail',
                        title : 'No user',
                        contents : 'Please check your email'
                    });

                    callback('No user\nPlease check your email');
                } else {
                    callback(null, connection, getUserDatasQueryResult[0]);
                }
            });
        },
        (connection, savedUserDatas, callback) => {
            encryption(userDatas.password, savedUserDatas['salt'], (encryptionError, salt, encryptionResult) => {
                if(encryptionError) {
                    connection.release();

                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Encryption fail',
                        contents : encryptionError
                    });

                    callback('Encryption fail\n' + encryptionError);
                } else if(encryptionResult == savedUserDatas['hashed_password']) {
                    callback(null, connection, savedUserDatas);
                } else {
                    connection.release();

                    res.status(400).send({
                        stat : 'Fail',
                        title : 'No user',
                        contents : 'Please check your password'
                    });

                    callback('No user\nPlease check your password');
                }
            });
        },
        (connection, savedUserDatas, callback) => {
            if(savedUserDatas['authorization'] == '0') {
                connection.release();

                res.status(400).send({
                    stat : 'Fail',
                    title : 'Not authorized',
                    contents : 'You\'re not authorized user'
                });

                callback('Not authorized\nYou\'re not authorized user');
            } else {
                jwt.createToken(savedUserDatas['id'], (createTokenError, createTokenResult) => {
                    if(createTokenError) {
                        connection.release();
    
                        res.status(500).send({
                            stat : 'Fail',
                            title : 'Create jwt fail',
                            contents : createTokenError
                        });
    
                        callback('Create jwt fail\n' + createTokenError);
                    }
                    else {
                        callback(null, connection, savedUserDatas, createTokenResult);
                    }
                });
            }
        },
        (connection, savedUserDatas, token, callback) => {
            let setUserTokenParameter = {
                id : savedUserDatas['id'],
                token : token
            }
            
            let setUserTokenQuery = mybatis.mappingSQLStatement('users/accounts', 'sign_in', 'setUserToken', setUserTokenParameter);
            
            connection.query(setUserTokenQuery, (setUserTokenQueryError, setUserTokenQueryResult) => {
                connection.release();
    
                if(setUserTokenQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set user token query fail',
                        contents : setUserTokenQueryError
                    });

                    callback('Set user token query fail\n' + setUserTokenQueryError);
                } else if(setUserTokenQueryResult.affectedRows == 1) {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Sign in success',
                        contents : 'Sign in task success',
                        token : token,
                        id : savedUserDatas['id'],
                        email : savedUserDatas['email'],
                        name : savedUserDatas['name'],
                        imageURL : savedUserDatas['image_url']
                    });

                    callback(null, 'Sign in success\nSign in task success, please check data');
                } else {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Unsuspected fail',
                        contents : 'Please ask to server admin'
                    });

                    callback('Unsuspected fail\nPlease ase to server admin');
                }
            })
        }
    ];

    async.waterfall(usersAccountsSignInTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Users accounts sign-up task error\n' + asyncError);
        else console.log('Async Success : Users accounts sign-up task success\n' + asyncResult);
    });
});

module.exports = router;