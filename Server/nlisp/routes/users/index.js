const express = require('express');
const router = express.Router();

const accountsRouter = require('./accounts/index');
const authorizationsRouter = require('./authorizations/index');
const tokensRouter = require('./tokens/index');
const adminRouter = require('./admin');

router.use('/accounts', accountsRouter);
router.use('/authorizations', authorizationsRouter);
router.use('/tokens', tokensRouter);
router.use('/admin', adminRouter);

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /users is connected'
    });
})

module.exports = router;