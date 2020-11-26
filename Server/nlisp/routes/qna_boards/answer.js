const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /qna-boards/answer is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    let answerContent = req.body.answerContent;
    let qnaBoardId = req.body.qnaBoardId;

    let qnaBoardsAnswerTask = [
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
            if(userId == 1 || userId == 2) {
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
            } else {
                res.status(400).send({
                    stat : 'Fail',
                    title : 'Not authorized user',
                    content : 'You don\'t have authorize for this board'
                });

                callback('Not authorized user\nYou don\'t have authorize for this board');
            } 
        },
        (connection, userId, callback) => {
            let setQnaBoardAnswerParameter = {
                id : qnaBoardId,
                answerContent : answerContent,
                adminId : userId
            };

            let setQnaBoardAnswerQuery = mybatis.mappingSQLStatement('qna_boards', 'answer', 'setQnaBoardAnswer', setQnaBoardAnswerParameter);

            connection.query(setQnaBoardAnswerQuery, (setQnaBoardAnswerQueryError, setQnaBoardAnswerQueryResult) => {
                connection.release();
                
                if(setQnaBoardAnswerQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set qna board answer query fail',
                        contents : setQnaBoardAnswerQueryError
                    });

                    callback('Set qna board answer query fail\n' + setQnaBoardAnswerQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Answer qna board has success',
                        contents : 'Answer qna board task has success'
                    });

                    callback(null, 'Answer qna board has success\nAnswer qna board task has success');
                }
            });
        }
    ];

    async.waterfall(qnaBoardsAnswerTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Qna-boards answer task error\n' + asyncError);
        else console.log('Async Success : Qna-boards answer task success\n' + asyncResult);
    });
});

module.exports = router;