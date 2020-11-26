const express = require('express');
const router = express.Router();
const async = require('async');

const authorizationValidity = require('../../../private_modules/validitys/authorization');
const awsRds = require('../../../private_modules/databases/aws_rds');
const mybatis = require('../../../private_modules/databases/mybatis');
const smtp = require('../../../private_modules/smtp');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /users/authorizations/send-email is connected'
    });
})

router.post('/', (req, res) => {
    let email = req.body.email;
    
    let authorizationSendMailTask = [
        (callback) => {
            authorizationValidity.emailCheck(email, (emailCheckError, emailCheckResult) => {
                if(emailCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Email check fail',
                        contents : emailCheckError
                    });

                    callback('Email check fail\n' + emailCheckError);
                } else {
                    callback(null, emailCheckResult);
                }
            });
        },
        (emailCheckResult, callback) => {
            smtp.send(email, (sendError, sendResult, authorizationCode) => {
                if(sendError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Send mail fail',
                        content : sendError
                    });

                    callback('Send mail fail\n' + sendError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Send mail success',
                        content : 'Send mail task success',
                        authorizationCode : authorizationCode
                    });

                    callback(null, 'Send mail success\nSend mail task success, please check data');
                }
            });
        }
    ];

    async.waterfall(authorizationSendMailTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Users authorization send-mail task error\n' + asyncError);
        else console.log('Async Success : Users authorization send-mail task success\n' + asyncResult);
    });
});

module.exports = router;