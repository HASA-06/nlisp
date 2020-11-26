module.exports.check = function(boardDatas, userId, callbackFunction) {
    for(var i = 0; i < boardDatas.length; i++) {
        if(boardDatas[i]['userId'] == userId) boardDatas[i]['isUser'] = 'Y';
        else boardDatas[i]['isUser'] = 'N';

        if(i == boardDatas.length - 1) {
            callbackFunction(boardDatas);
        }
    }
}