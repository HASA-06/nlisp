const express = require('express');
const router = express.Router();
const async = require('async');

const awsRds = require('../../private_modules/databases/aws_rds');
const mybatis = require('../../private_modules/databases/mybatis');

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /mento-menti-boards/hit is connected'
    });
});

router.post('/', (req, res) => {
    let mentoMentiBoardId = req.body.mentoMentiBoardId;

    let mentoMentiBoardsHitTask = [
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
            let setMentoMentiBoardHitParameter = {
                mentoMentiBoardId : mentoMentiBoardId
            };

            let setMentoMentiBoardHitQuery = mybatis.mappingSQLStatement('mento_menti_boards', 'hit', 'setMentoMentiBoardHit', setMentoMentiBoardHitParameter);

            connection.query(setMentoMentiBoardHitQuery, (setMentoMentiBoardHitQueryError, setMentoMentiBoardHitQueryResult) => {
                connection.release();
                
                if(setMentoMentiBoardHitQueryError) {
                    res.status(500).send({
                        stat : 'Fail',
                        title : 'Set mento-menti board hit query fail',
                        content : setMentoMentiBoardHitQueryError
                    });

                    callback('Set mento-menti board hit query fail\n' + setMentoMentiBoardHitQueryError);
                } else {
                    res.status(201).send({
                        stat : 'Success',
                        title : 'Update mento-menti board hit success',
                        contents : 'Update mento-menti board hit task success',
                    });

                    callback(null, 'Update mento-menti board hit success\nUpdate mento-menti board hit task success');
                }
            });
        }
    ];

    async.waterfall(mentoMentiBoardsHitTask, (asyncError, asyncResult) => {
        if(asyncError) console.log('Async Fail : Mento-menti-boards hit task error\n' + asyncError);
        else console.log('Async Success : Mento-menti-boards hit task success\n' + asyncResult);
    });
});

module.exports = router;