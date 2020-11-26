const express = require('express');
const router = express.Router();
const async = require('async');

const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /bulletin-boards/hit is connected'
    });
});

router.post('/', (req, res) => {
    let bulletinBoardId = req.body.bulletinBoardId;

    let bulletinBoardsHitTask = [
        (callback) => {
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
            let setBulletinBoardHitParameter = {
                bulletinBoardId : bulletinBoardId
            };

            let setBulletinBoardHitQuery = mybatis.mappingSQLStatement('bulletin_boards', 'hit', 'setBulletinBoardHit', setBulletinBoardHitParameter);

            connection.query(setBulletinBoardHitQuery, (setBulletinBoardHitQueryError, setBulletinBoardHitQueryResult) => {
                connection.release();
                
                if(setBulletinBoardHitQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set bulletin board hit query fail',
                        content : setBulletinBoardHitQueryError
                    });

                    callback('Set bulletin board hit query fail\n' + setBulletinBoardHitQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Update bulletin board hit success',
                        contents : 'Update bulletin board hit task success',
                    });

                    callback(null, 'Update bulletin board hit success\nUpdate bulletin board hit task success');
                }
            });
        }
    ];

    async.waterfall(bulletinBoardsHitTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Bulletin-boards hit task error\n' + asyncError);
        else console.log('Async Success : Bulletin-boards hit task success\n' + asyncResult);
    });
});

module.exports = router;