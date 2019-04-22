var multer = require('multer');

const profileFilter = (req, file, callback) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true)
    } else {
        callback(null, false);
    }
}


const final=(req,file,callback)=>
{
    if(file.mimetype==='application/x-zip-compressed')
    {
        callback(null,true)

    }
    else{
        callback(null,false);
    }
}
exports.Profile_pic = function () {
    var Storage = multer.diskStorage({
        destination: './public/users/profile-pics',
        filename: function (req, file, callback) {


            callback(null, file.fieldname + '-' + Date.now() + file.originalname);


        }
    });
    var upload = multer({
        storage: Storage,
        fileFilter: profileFilter

    });
    return upload;
}
exports.Portfolio_pic = function () {
    var Storage = multer.diskStorage({
        destination: './public/users/Portfolio-pics',
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + file.originalname);
        }
    });
    var upload = multer({
        storage: Storage,
        fileFilter: profileFilter
    });
    return upload;
}
exports.Design_pic = function () {
    var Storage = multer.diskStorage({
        destination: './public/users/Contest',
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + file.originalname);
        }
    });
    var upload = multer({
        storage: Storage,
        fileFilter: profileFilter
    });
    return upload;
}
exports.FinalFiles = function () {
    var Storage = multer.diskStorage({
        destination: './public/users/FinalFiles',
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + file.originalname);
        }
    });
    var upload = multer({
        storage: Storage,
        fileFilter: final
    });
    return upload;
}