module.exports.arrayDataCheck = function(datas, callbackFunction) {
    var datasCount = datas.count;
    var datasKeys = datas.keys;

    for(var indexOfData = 0; indexOfData < datasCount; indexOfData++) {
        if(isEmpty(datas[datasKeys[indexOfData]])) {
            callbackFunction('Not enough input');
            break;
        }

        if(indexOfData == datasCount - 1) {
            callbackFunction(null, 'Create bulletin board data validity check success');
        }
    }
}

module.exports.singleDataCheck = function(data, callbackFunction) {
    if(isEmpty(data)) callbackFunction('Not enough input');
    else callbackFunction(null, 'Delete bulletin board data validity check success');
}

function isEmpty(data) {
    if(data == null || data == '' || data === undefined) return true;

    return false;
}