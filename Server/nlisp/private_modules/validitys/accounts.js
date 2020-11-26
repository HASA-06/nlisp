module.exports.signUpCheck = (datas, callbackFunction) => {
    var datasCount = datas.count;
    var datasKeys = datas.keys;

    for(var indexOfData = 0; indexOfData < datasCount; indexOfData++) {
        if(isEmpty(datas[datasKeys[indexOfData]])) {
            callbackFunction('Not enough input');
            break;
        }

        if(indexOfData == datasCount - 1) {
            if(emailCheck(datas.email)) callbackFunction('Please check email');
            else if(passwordCheck(datas.password, datas.passwordAccept)) callbackFunction('Please check password');
            else if(phoneNumberCheck(datas.phoneNumber)) callbackFunction('Please check phone number');
            else if(nameCheck(datas.name)) callbackFunction('Please check name');
            else callbackFunction(null, 'Sign-up validity check success');
        }
    }
}

module.exports.signInCheck = (datas, callbackFunction) => {
    var datasCount = datas.count;
    var datasKeys = datas.keys;

    for(var indexOfData = 0; indexOfData < datasCount; indexOfData++) {
        if(isEmpty(datas[datasKeys[indexOfData]])) {
            callbackFunction('Not enough input');
            break;
        }

        if(indexOfData == datasCount - 1) {
            if(emailCheck(datas.email)) callbackFunction('Please check email');
            else callbackFunction(null, 'Sign-in validity check success');
        }
    }
}

module.exports.updateCheck = (datas, callbackFunction) => {
    var datasCount = datas.count;
    var datasKeys = datas.keys;

    for(var indexOfData = 0; indexOfData < datasCount; indexOfData++) {
        if(isEmpty(datas[datasKeys[indexOfData]])) {
            callbackFunction('Not enough input');
            break;
        }

        if(indexOfData == datasCount - 1) {
            if(emailCheck(datas.email)) callbackFunction('Please check email');
            else if(phoneNumberCheck(datas.phoneNumber)) callbackFunction('Please check phone number');
            else if(nameCheck(datas.name)) callbackFunction('Please check name');
            else callbackFunction(null, 'Update validity check success');
        }
    }
}

function isEmpty(data) {
    if(data == null || data == '' || data === undefined) return true;

    return false;
}

function emailCheck(email) {
    var emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if(!emailRegExp.test(email)) return true;
    else return false;
}

function passwordCheck(password, passwordAccept) {
    var passwordRegExp =  /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,18}$/;

    if(!passwordRegExp.test(password)) return true;
    else if(password != passwordAccept) return true;
    else return false;
};

function nameCheck(name) {
    var nameRegExp = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,4}/;

    if(!nameRegExp.test(name)) return true;
    else return false;
}

function phoneNumberCheck(phoneNumber) {
    var phoneNumberRegExp = /^\d{10,11}/;

    if(!phoneNumberRegExp.test(phoneNumber)) return true;
    else return false;
}