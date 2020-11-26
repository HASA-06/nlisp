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
        title : 'URL /activity-boards/update is connected'
    });
});

router.post('/', awsS3.activityUpload.single('activityNewImage'), (req, res) => {
    let userToken = req.headers.token;
    let activityBoardNewImageURL = (req.file) ? req.file.location : null;
    let activityBoardNewImageName = (req.file) ? req.file.originalname.split('.')[0] + '.' + req.file.originalname.split('.').pop() : null;
    let activityBoardDatas = {
        id : req.body.id,
        title : req.body.title,
        content : req.body.content,
        imageURL : req.body.imageURL,
        imageName : req.body.imageName
    };

    activityBoardDatas.count = Object.keys(activityBoardDatas).length;
    activityBoardDatas.keys = ["id", "title", "content", "imageURL", "imageName"];

    let activityBoardsUpdateTask = [
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
                        title : 'Update validity check fail',
                        content : arrayDataCheckError
                    });

                    callback('Update validity check fail\n' + arrayDataCheckError);
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
            if(activityBoardNewImageURL == null) {
                let setActivityBoardDataParameter = {
                    id : activityBoardDatas.id,
                    title : activityBoardDatas.title,
                    content : activityBoardDatas.content,
                    imageURL : activityBoardDatas.imageURL,
                    imageName : activityBoardDatas.imageName,
                    userId : userId
                };

                let setActivityBoardDataQuery = mybatis.mappingSQLStatement('activity_boards', 'update', 'setActivityBoardData', setActivityBoardDataParameter);

                connection.query(setActivityBoardDataQuery, (setActivityBoardDataQueryError, setActivityBoardDataQueryResult) => {
                    connection.release();
                    
                    if(setActivityBoardDataQueryError) {
                        res.status(500).send({
                            stat : 'Fail',
                            title : 'Set Activity board data query fail',
                            contents : setActivityBoardDataQueryError
                        });
    
                        callback('Set Activity board data query fail\n' + setActivityBoardDataQueryError);
                    } else {
                        res.status(201).send({
                            stat : 'Success',
                            title : 'Update activity board data success',
                            contents : 'Update activity board data task success',
                            activityBoardData : setActivityBoardDataParameter
                        });
    
                        callback(null, 'Update activity board data success\nUpdate activity board data task success');
                    }
                });
            } else {
                awsS3.activityDelete(activityBoardDatas.imageName, (activityDeleteError, activityDeleteResult) => {
                    if(activityDeleteError) {
                        res.status(500).send({
                            stat : 'Fail',
                            title : 'Delete past activity board image fail',
                            content : activityDeleteError
                        });

                        callback('Delete past activity board image fail\n' + activityDeleteError);
                    } else {
                        let setActivityBoardDataParameter = {
                            id : activityBoardDatas.id,
                            title : activityBoardDatas.title,
                            content : activityBoardDatas.content,
                            imageURL : activityBoardNewImageURL,
                            imageName : activityBoardNewImageName,
                            userId : userId
                        };

                        let setActivityBoardDataQuery = mybatis.mappingSQLStatement('activity_boards', 'update', 'setActivityBoardData', setActivityBoardDataParameter);

                        connection.query(setActivityBoardDataQuery, (setActivityBoardDataQueryError, setActivityBoardDataQueryResult) => {
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
                                    title : 'Update activity board data success',
                                    contents : 'Update activity board data task success',
                                    activityBoardData : setActivityBoardDataParameter
                                });
            
                                callback(null, 'Update activity board data success\nUpdate activity board data task success');
                            }
                        });
                    }
                });
            }
        }
    ];

    async.waterfall(activityBoardsUpdateTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Activity-boards update task error\n' + asyncError);
        else console.log('Async Success : Activity-boards update task success\n' + asyncResult);
    });
});

module.exports = router;