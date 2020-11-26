const nodemailer = require('nodemailer');
const nodemailerSMTPTransport = require('nodemailer-smtp-transport');
const smtpConfig = require('../configs/smtp.json');

const transporter = nodemailer.createTransport(nodemailerSMTPTransport({
    service : smtpConfig.mailService,
    host : smtpConfig.mailHost,
    auth : {
        user : smtpConfig.mailId,
        pass : smtpConfig.mailPassword
    }
}));

module.exports.send = function(targetMail, callbackFunction) {
    const authorizationCode = Math.floor(Math.random() * 1000000) + 1;
    const mailSubject = '[NLISP] 인증코드 발송 메일입니다'
    const mailContent = '인증메일 내역입니다<br/><br/> 인증번호는 <h1 style="color : blue;">' + authorizationCode + '</h1><br/>입니다. 60초 내로 입력해주세요'

    const mailOptions = {
        from : 'NLISP Admins',
        to : targetMail,
        subject : mailSubject,
        html : mailContent
    };

    transporter.sendMail(mailOptions, (sendMailError, sendMailResult) => {
        if(sendMailError) {
            callbackFunction('SMTP send mail fail\n' + sendMailError);
        } else {
            callbackFunction(null, sendMailResult, authorizationCode);
        }

        transporter.close();
    });
}