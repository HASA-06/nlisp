const express = require('express');
const router = express.Router();

const sendMailRouter = require('./send_mail');

router.use('/send-mail', sendMailRouter);

router.get('/', (req, res) => {
    res.status(200).send({
        stat : 'Success',
        title : 'URL /users/authorizations is connected'
    });
})

module.exports = router;