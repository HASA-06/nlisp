const express = require('express');
const router = express.Router();
const async = require('async');

const accountValidity = require('../../../private_modules/validitys/accounts');
const authorizationValidity = require('../../../private_modules/validitys/authorization');
const encryption = require('../../../private_modules/encryption');
const awsRds = require('../../../private_modules/databases/aws_rds');
const awsS3 = require('../../../private_modules/databases/aws_s3');
const mybatis = require('../../../private_modules/databases/mybatis');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /users/accounts/sign-up is connected'
    });
});

router.post('/', awsS3.userUpload.single('userImage'), (req, res) => {
    let userDatas = {
        email : req.body.userEmail,
        password : req.body.userPassword,
        passwordAccept : req.body.userPasswordAccept,
        name : req.body.userName,
        phoneNumber : req.body.userPhoneNumber.replace(/\-/g, ''),
        studentNumber : req.body.userStudentNumber,
    };
    let authorizationCode = req.body.authorizationCode;
    let clientAuthorizationCode = req.body.clientAuthorizationCode;

    userDatas.count = Object.keys(userDatas).length;
    userDatas.keys = ['email', 'password', 'passwordAccept', 'name', 'phoneNumber', 'studentNumber'];

    let usersAccountsSignUpTask = [
        (callback) => {
            authorizationValidity.codeCheck(authorizationCode, clientAuthorizationCode, (codeCheckError, codeCheckResult) => {
                if(codeCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Code check fail',
                        contents : codeCheckError
                    });

                    callback('Code check fail\n' + codeCheckError);
                } else {
                    callback(null, codeCheckResult);
                }
            });
        },
        (codeCheckResult, callback) => {
            accountValidity.signUpCheck(userDatas, (signUpCheckError, signUpCheckResult) => {
                if(signUpCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Sign up check fail',
                        contents : signUpCheckError
                    });

                    callback('Sign up check fail\n' + signUpCheckError);
                } else {
                    callback(null, signUpCheckResult);
                }
            });
        },
        (signUpCheckResult, callback) => {
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
            let checkDuplicateParameter = {
                email : userDatas.email
            };

            let checkDuplicateQuery = mybatis.mappingSQLStatement('users/accounts', 'sign_up', 'checkDuplicate', checkDuplicateParameter);

            connection.query(checkDuplicateQuery, (checkDuplicateQueryError, checkDuplicateQueryResult) => {
                if(checkDuplicateQueryError) {
                    connection.release();

                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Check duplicate query fail',
                        contents : checkDuplicateQueryError
                    });

                    callback('Check duplicate query fail\n' + checkDuplicateQueryError);
                } else if(checkDuplicateQueryResult.length >= 1) {
                    connection.release();

                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Email is duplicated',
                        contents : 'Email is duplicated, other email is needed'
                    });

                    callback('Email is duplicated\nEmail is duplicated, other email is needed');
                } else {
                    callback(null, connection);
                }
            });
        },
        (connection, callback) => {
            encryption(userDatas.password, 'empty', (encryptionError, salt, encryptionResult) => {
                if(encryptionError) {
                    connection.release();

                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Encryption fail',
                        contents : encryptionError
                    });

                    callback('Encryption fail\n' + encryptionError);
                } else {
                    callback(null, connection, salt, encryptionResult);
                }
            });
        },
        (connection, salt, hashedPassword, callback) => {
            let setUserDatasParameter = {
                email : userDatas.email,
                name : userDatas.name,
                hashed_password : hashedPassword,
                salt : salt,
                student_number : userDatas.studentNumber,
                phone_number : userDatas.phoneNumber,
                image_url : (req.file) ? req.file.location : null,
                image_name : (req.file) ? req.file.originalname.split('.')[0] + '.' + req.file.originalname.split('.').pop() : null,
                kakao_id : (req.body.kakao_id) ? req.body.kakao_id : null
            };

            let setUserDatasQuery = mybatis.mappingSQLStatement('users/accounts', 'sign_up', 'setUserDatas', setUserDatasParameter);

            connection.query(setUserDatasQuery, (setUserDatasQueryError, setUserDatasQueryResult) => {
                connection.release();

                if(setUserDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set user datas query fail',
                        contents : setUserDatasQueryError
                    });

                    callback('Set user datas query fail\n' + setUserDatasQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Sign up success',
                        contents : 'Sign up task success'
                    });

                    callback(null, 'Sign up success\nSign up task success');
                }
            });
        }
    ];

    async.waterfall(usersAccountsSignUpTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Users accounts sign-up task error\n' + asyncError);
        else console.log('Async Success : Users accounts sign-up task success\n' + asyncResult);
    });
})

module.exports = router;