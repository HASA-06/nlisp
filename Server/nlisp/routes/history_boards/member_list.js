const express = require('express');
const router = express.Router();

const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    let userToken = req.headers.token;

    let historyBoardsMemberListTask = [
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
            let getMemberDatasParameter = null;
            
            let getMemberDatasQuery = mybatis.mappingSQLStatement('history_boards', 'member_list', 'getMemberDatas', getMemberDatasParameter);

            connection.query(getMemberDatasQuery, (getMemberDatasQueryError, getMemberDatasQueryResult) => {
                if(getMemberDatasQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Get member datas query fail',
                        contents : getMemberDatasQueryError
                    });

                    callback('Get member datas query fail\n' + getMemberDatasQueryError);
                } else {
                    res.status(200).send({
                        stat : 'Success',
                        title : 'Read member list success',
                        contents : 'Read member list task success, please check data',
                        memberList : getMemberDatasQueryResult
                    });

                    callback(null, 'Read member list success\nRead member list task success, please check data')
                }
            });
        }
    ];

    async.waterfall(historyBoardsMemberListTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : History-boards update task error\n' + asyncError);
        else console.log('Async Success : History-boards update task success\n' + asyncResult);
    });
});

module.exports = router;