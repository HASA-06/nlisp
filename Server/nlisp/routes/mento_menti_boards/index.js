const express = require('express');
const router = express.Router();

const listRouter = require('./list');
const createRouter = require('./create');
const readRouter = require('./read');
const updateRouter = require('./update');
const deleteRouter = require('./delete');
const hitRouter = require('./hit');
const readDetailRouter = require('./read_detail');

router.use('/list', listRouter);
router.use('/create', createRouter);
router.use('/read', readRouter);
router.use('/update', updateRouter);
router.use('/delete', deleteRouter);
router.use('/hit', hitRouter);
router.use('/read-detail', readDetailRouter);

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /mento-menti-boards is connected'
    });
})

module.exports = router;