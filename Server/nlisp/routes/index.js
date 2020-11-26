const express = require('express');
const router = express.Router();

const usersRouter = require('./users/index');
const activityBoardsRouter = require('./activity_boards/index');
const bulletinBoardsRouter = require('./bulletin_boards/index');
const mentoMentiBoardsRouter = require('./mento_menti_boards/index');
const noticeBoardsRouter = require('./notice_boards/index');
const scheduleBoardsRouter = require('./schedule_boards/index');
const historyBoardsRouter = require('./history_boards/index');
const qnaBoardsRouter = require('./qna_boards/index');

router.use('/users', usersRouter);
router.use('/activity-boards', activityBoardsRouter);
router.use('/bulletin-boards', bulletinBoardsRouter);
router.use('/mento-menti-boards', mentoMentiBoardsRouter);
router.use('/notice-boards', noticeBoardsRouter);
router.use('/schedule-boards', scheduleBoardsRouter);
router.use('/history-boards', historyBoardsRouter);
router.use('/qna-boards', qnaBoardsRouter);

router.get('/', function(req, res, next) {
  res.status(200).send({
    stat : 'Success',
    title : 'URL / is connected'
  });
});

module.exports = router;
