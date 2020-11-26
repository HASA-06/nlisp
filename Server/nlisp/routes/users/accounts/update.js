const express = require('express');
const router = express.Router();
const async = require('async');

const accountValidity = require('../../../private_modules/validitys/accounts');
const tokenValidity = require('../../../private_modules/validitys/token');
const awsRds = require('../../../private_modules/databases/aws_rds');
const mybatis = require('../../../private_modules/databases/mybatis');
const jwt = require('../../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /users/accounts/update is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    
    let userDatas = {
        email : req.body.email,
        name : req.body.name,
        imageURL : req.body.imageURL,
        imageName : req.body.imageName,
        studentNumber : req.body.studentNumber,
        phoneNumber : req.body.phoneNumber
    };

    userDatas.count = Object.keys(userDatas).length;
    userDatas.keys = ['email', 'name', 'imageURL', 'imageName', 'studentNumber', 'phoneNumber'];

    let usersAccountsUpdateTask = [
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
            accountValidity.updateCheck(userDatas, (updateCheckError, updateCheckResult) => {
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
            let setUserDatasParameter = {
                id : userId,
                email : userDatas.email,
                name : userDatas.name,
                imageURL : userDatas.imageURL,
                imageName : userDatas.imageName,
                studentNumber : userDatas.studentNumber,
                phoneNumber : userDatas.phoneNumber
            };
            
            let setUserDatasQuery = mybatis.mappingSQLStatement('users/accounts', 'update', 'setUserDatas', setUserDatasParameter);

            connection.query(setUserDatasQuery, (setUserDatasQueryError, setUserDatasQueryResult) => {
                connection.release();
                
                if(setUserDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set user data query fail',
                        contents : setUserDatasQueryError
                    });

                    callback('Set user data query fail\n' + setUserDatasQueryError);
                } else {
                    delete userDatas.keys;
                    delete userDatas.count;

                    res.status(201).send({
                        stat : 'Success',
                        title : 'Update user data success',
                        contents : 'Update user data task success, please check data',
                        userData : userDatas
                    });

                    callback(null, 'Update user data success\nUpdate user data task success, please check data');
                }
            });
        }
    ];

    async.waterfall(usersAccountsUpdateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Users accounts info task error\n' + asyncError);
        else console.log('Async Success : Users accounts info task success\n' + asyncResult);
    });
});

module.exports = router;