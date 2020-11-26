module.exports.createCheck = function(datas, callbackFunction) {
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

module.exports.updateCheck = function(datas, callbackFunction) {
    var datasCount = datas.count;
    var datasKeys = datas.keys;

    for(var indexOfData = 0; indexOfData < datasCount; indexOfData++) {
        if(isEmpty(datas[datasKeys[indexOfData]])) {
            callbackFunction('Not enough input');
            break;
        }

        if(indexOfData == datasCount - 1) {
            callbackFunction(null, 'Update bulletin board data validity check success');
        }
    }
}

module.exports.deleteCheck = function(bulletinBoardId, callbackFunction) {
    if(isEmpty(bulletinBoardId)) callbackFunction('Not enough input');
    else callbackFunction(null, 'Delete bulletin board data validity check success');
}

function isEmpty(data) {
    if(data == null || data == '' || data === undefined) return true;

    return false;
}