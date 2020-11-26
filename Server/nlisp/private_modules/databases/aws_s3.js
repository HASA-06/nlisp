const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('configs/databases/aws_s3.json');
const s3 = new aws.S3();

module.exports.userUpload = multer({
    storage : multerS3({
        s3 : s3,
        bucket : 'nlisppictures/users',
        acl : 'public-read',
        key : function(req, file, cb) {
            cb(null, file.originalname.split('.')[0] + '.' + file.originalname.split('.').pop());
        }
    })
});


module.exports.userDelete = (imageName, callbackFunction) => {
    let deleteObjectParameter = {
        Bucket : 'nlisppictures',
        Key : 'users/' + imageName
    };

    s3.deleteObject(deleteObjectParameter, (deleteObjectError) => {
        if(deleteObjectError) callbackFunction('Delete s3 picture fail\n' + deleteObjectError);
        else callbackFunction(null, 'Delete task has success');
    });
}

module.exports.activityUpload = multer({
    storage : multerS3({
        s3 : s3,
        bucket : 'nlisppictures/activitys',
        acl : 'public-read',
        key : function(req, file, cb) {
            cb(null, file.originalname.split('.')[0] + '.' + file.originalname.split('.').pop());
        }
    })
});

module.exports.activityDelete = (imageName, callbackFunction) => {
    let deleteObjectParameter = {
        Bucket : 'nlisppictures',
        Key : 'activitys/' + imageName
    };

    s3.deleteObject(deleteObjectParameter, (deleteObjectError) => {
        if(deleteObjectError) callbackFunction('Delete s3 picture fail\n' + deleteObjectError);
        else callbackFunction(null, 'Delete task has success');
    });
}
