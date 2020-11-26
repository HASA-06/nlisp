const express = require('express');
const router = express.Router();

const askRouter = require('./ask');
const answerRouter = require('./answer');
const readAskRouter = require('./read_ask');
const readAnswerRouter = require('./read_answer');
const deleteRouter = require('./delete');

router.use('/ask', askRouter);
router.use('/answer', answerRouter);
router.use('/read-ask', readAskRouter);
router.use('/read-answer', readAnswerRouter);
router.use('/delete', deleteRouter);


router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /qna-boards is connected'
    });
});

module.exports = router;