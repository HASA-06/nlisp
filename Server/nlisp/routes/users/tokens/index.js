const express = require('express');
const router = express.Router();

const checkRouter = require('./check');
const reIssueRouter = require('./re_issue');

router.use('/check', checkRouter);
router.use('/re-issue', reIssueRouter);

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /users/tokens is connected'
    });
})

module.exports = router;