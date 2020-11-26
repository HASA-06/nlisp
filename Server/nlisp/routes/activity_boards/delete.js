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
        title : 'URL /activity-boards/delete is connected'
    });
});

router.post('/', (req, res) => {
    let userToken = req.headers.token;
    let activityBoardData = {
        id : req.body.id,
        title : req.body.title,
        content : req.body.content,
        imageURL : req.body.imageURL,
        imageName : req.body.imageName
    };

    activityBoardData.count = Object.keys(activityBoardData).length;
    activityBoardData.keys = ["id", "title", "content", "imageURL", "imageName"];

    let activityBoardsDeleteTask = [
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
            activityBoardsValidity.arrayDataCheck(activityBoardData, (arrayDataCheckError, arrayDataCheckResult) => {
                if(arrayDataCheckError) {
                    res.status(400).send({
                        stat : 'Fail',
                        title : 'Delete activity board validity check fail',
                        content : arrayDataCheckError
                    });

                    callback('Delete activity board validity check fail\n' + arrayDataCheckError);
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
            awsS3.activityDelete(activityBoardData.imageName, (activityDeleteError, activityDeleteResult) => {
                if(activityDeleteError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Delete past activity board image fail',
                        content : activityDeleteError
                    });

                    callback('Delete past activity board image fail\n' + activityDeleteError);
                } else {
                    let deleteActivityBoardDataParameter = {
                        id : activityBoardData.id,
                        userId : userId
                    };

                    let deleteActivityBoardDataQuery = mybatis.mappingSQLStatement('activity_boards', 'delete', 'deleteActivityBoardData', deleteActivityBoardDataParameter);

                    connection.query(deleteActivityBoardDataQuery, (deleteActivityBoardDataQueryError, deleteActivityBoardDataQueryResult) => {
                        connection.release();
                        
                        if(deleteActivityBoardDataQueryError) {
                            res.status(500).send({
                                stat : 'Fail',
                                title : 'Delete activity board data query fail',
                                contents : deleteActivityBoardDataQueryError
                            });
        
                            callback('Delete activity board data query fail\n' + deleteActivityBoardDataQueryError);
                        } else if(deleteActivityBoardDataQueryResult.affectedRows == 0) {
                            res.status(500).send({
                                stat : 'Fail',
                                title : 'Unsuspected fail',
                                contents : 'Please ask to server admin'
                            });
        
                            callback('Unsuspected fail\nPlease ask to server admin');
                        } else {
                            res.status(201).send({
                                stat : 'Success',
                                title : 'Delete activity board success',
                                contents : 'Delete activity board task success',
                            });
        
                            callback(null, 'Delete activity board success\nDelete activity board task success');
                        }
                    });
                }
            });
        }
    ];

    async.waterfall(activityBoardsDeleteTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Bulletin-boards delete task error\n' + asyncError);
        else console.log('Async Success : Bulletin-boards delete task success\n' + asyncResult);
    });
});

module.exports = router;