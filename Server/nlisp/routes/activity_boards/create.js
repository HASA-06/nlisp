const express = require('express');
const router = express.Router();
const async = require('async');

const tokenValidity = require('../../private_modules/validitys/token');
const activityBoardsValidity = require('../../private_modules/validitys/activity_boards');
const awsRds = require('../../private_modules/databases/aws_rds');
const awsS3 = require('../../private_modules/databases/aws_s3');
const mybatis = require('../../private_modules/databases/mybatis');
const jwt = require('../../private_modules/jwt');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /activity-boards/create is connected'
    });
});

router.post('/', awsS3.activityUpload.single('activityImage'), (req, res) => {
    let userToken = req.headers.token;

    let activityBoardDatas = {
        title : req.body.title,
        content : req.body.content,
        imageURL : (req.file) ? req.file.location : null,
        imageName : (req.file) ? req.file.originalname.split('.')[0] + '.' + req.file.originalname.split('.').pop() : null
    };

    activityBoardDatas.count = Object.keys(activityBoardDatas).length;
    activityBoardDatas.keys = ["title", "content", "imageURL", "imageName"];

    let activityBoardsCreateTask = [
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
            activityBoardsValidity.arrayDataCheck(activityBoardDatas, (arrayDataCheckError, arrayDataCheckResult) => {
                if(arrayDataCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Activity board create validity check fail',
                        content : arrayDataCheckError
                    });

                    callback('Activity board create validity check fail\n' + arrayDataCheckError);
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
            let setActivityBoardDataParameter = {
                title : activityBoardDatas.title,
                content : activityBoardDatas.content,
                imageURL : activityBoardDatas.imageURL,
                imageName : activityBoardDatas.imageName,
                userId : userId
            };

            let setActivityBoardDataQuery = mybatis.mappingSQLStatement('activity_boards', 'create', 'setActivityBoardData', setActivityBoardDataParameter);

            connection.query(setActivityBoardDataQuery, (setActivityBoardDataQueryError, setActivityBoardDataQueryResult) => {
                connection.release();
                
                if(setActivityBoardDataQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set activity board data query fail',
                        contents : setActivityBoardDataQueryError
                    });

                    callback('Set activity board data query fail\n' + setActivityBoardDataQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Create activity-board success',
                        contents : 'Create activity-board task success'
                    });

                    callback(null, 'Create activity-board success\nCreate activity-board task success');
                }
            });
        }
    ];

    async.waterfall(activityBoardsCreateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Activity boards create task error\n' + asyncError);
        else console.log('Async Success : Activity boards create task success\n' + asyncResult);
    });
});

module.exports = router;