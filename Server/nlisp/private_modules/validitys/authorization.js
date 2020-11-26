module.exports.emailCheck = (email, callbackFunction) => {
    if(isEmpty(email)) callbackFunction('Not enough input');
    else if(emailCheck(email)) callbackFunction('Please check email');
    else callbackFunction(null, 'Send mail validity check success');
}

module.exports.codeCheck = (authorizationCode, clientAuthorizationCode, callbackFunction) => {
    if(isEmpty(authorizationCode)) callbackFunction('Not enough input');
    else if(authorizationCode != clientAuthorizationCode) callbackFunction('Not equal authorizaion code');
    else callbackFunction(null, 'Authorizaion code check success');
}

function isEmpty(data) {
    if(data == null || data == '' || data === undefined) return true;

    return false;
}

function emailCheck(email) {
    var emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    var emailHost = email.substring(email.indexOf('@') + 1, email.length);
    console.log(emailHost);
    if(!emailRegExp.test(email)) return true;
    else if(emailHost != 'seoultech.ac.kr') return true;
    else return false;
}