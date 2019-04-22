var jimp = require('jimp')

exports.picresize = (req, res, next) => {
    jimp.read(req.file.buffer)
        .then((image) => {
            console.log('in');
            image.resize(220, 220);
            console.log('in1');
            image.write('./public/users/profile-pics')
            console.log('in2');
            next();
        }).catch((error) => {

            console.log(error);
        })

}