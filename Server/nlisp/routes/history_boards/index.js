const express = require('express');
const router = express.Router();

const createRouter = require('./create');
const readRouter = require('./read');
const deleteRouter = require('./delete');
const memberListRouter = require('./member_list');

router.use('/create', createRouter);
router.use('/read', readRouter);
router.use('/delete', deleteRouter);
router.use('/member-list', memberListRouter);

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /history-boards is connected'
    });
});

module.exports = router;