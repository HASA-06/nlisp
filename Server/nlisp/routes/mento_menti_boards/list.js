const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    let userToken = req.headers.token;
    let studentNumber = req.query.studentNumber;
    let limitStudentNumber = parseInt(studentNumber) + 1;

    let mentoMentiBoardsListTask = [
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
            let getMentoMentiMentoListParameter = {
                studentNumber : studentNumber + '000000',
                limitStudentNumber : (String(limitStudentNumber).length == 2) ? limitStudentNumber + '000000' : '0' + limitStudentNumber + '000000'
            };

            let getMentoMentiMentoListQuery = mybatis.mappingSQLStatement('mento_menti_boards', 'list', 'getMentoMentiMentoList', getMentoMentiMentoListParameter);

            connection.query(getMentoMentiMentoListQuery, (getMentoMentiMentoListQueryError, getMentoMentiMentoListQueryResult) => {
                connection.release();

                if(getMentoMentiMentoListQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get mento menti mento list query fail',
                        content : getMentoMentiMentoListQueryError
                    });

                    callback('Get mento menti mento list query fail\n' + getMentoMentiMentoListQueryError);
                } else {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'Get mento-menti mento list success',
                        content : 'Get mento-menti mento list task success, please check data',
                        mentoList : getMentoMentiMentoListQueryResult
                    });

                    callback(null, 'Get mento-menti mento list success\nGet mento-menti mento list task success, please check data');
                }
            });
        }
    ];

    async.waterfall(mentoMentiBoardsListTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Mento-menti boards list task error\n' + asyncError);
        else console.log('Async Success : Mento-menti boards list task success\n' + asyncResult);
    });
});

module.exports = router;