const jsonWebToken = require('jsonwebtoken');
const jwtConfig = require('../configs/jwt.json');

module.exports.createToken = (id, callbackFunction) => {
    var payload = {
        id: id
    };
    var option = {
        subject: jwtConfig.subject,
        issuer: jwtConfig.issuer,
        algorithm: jwtConfig.algorithm,
        expiresIn: jwtConfig.expiresIn
    };

    jsonWebToken.sign(payload, jwtConfig.secretKey.toString('base64'), option, (jsonWebTokenSignError, jsonWebTokenSignResult) => {
        if(jsonWebTokenSignError) {
            callbackFunction(jsonWebTokenSignError);
        } else {
            callbackFunction(null, jsonWebTokenSignResult);
        }
    });
}

module.exports.checkToken = function(token, callbackFunction) {
    jsonWebToken.verify(token, jwtConfig.secretKey.toString('base64'), (jsonWebTokenVerifyError, jsonWebTokenVerifyResult) => {
        if(jsonWebTokenVerifyError) {
            callbackFunction(jsonWebTokenVerifyError);
        } else {
            callbackFunction(null, jsonWebTokenVerifyResult);
        }
    });
}