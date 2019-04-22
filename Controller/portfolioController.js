var UserModel = require('../Models/User');
var PortModel = require('../Models/Portfolio');

exports.addportfolioGet = (req, res) => {
    res.render('addportfolio', {
        error: req.flash('error'),
        success: req.flash('success')
    });
}

exports.addportfolioPost = (req, res) => {
    if (!req.file) {
        req.flash('error', 'Please Must upload the Picture with Portfolio ')
        return res.redirect('/user/addportfolio');
    }
    UserModel.findById(req.user._id).then((user) => {

        var port = new PortModel({
            _Title: req.body.TITLE,
            _Desc: req.body.DESC,
            _Owner: req.user,
            _Picture: {
                _FileName: req.file.filename
            }
        });
        user._Portfolio.push(port);
        Promise.all([user.save(), port.save()])
            .then(() => {
                req.flash('success', 'SuccessFly Added PortFolio');
                res.redirect('/user/addportfolio');
            })
            .catch(() => {
                req.flash('error', 'Some error happend');
                res.redirect('/user/addportfolio');
            })
    }).catch(() => {
        req.flash('error', 'Some error happend');
        res.redirect('/user/addportfolio');
    })

}

//get Likes
exports.portLike = (req, res) => {

    PortModel.findByIdAndUpdate(req.body.POSTID, {
            $push: {
                _Likes: req.user._id
            },
            $inc: {
                _LikeCount: 1
            }
        }).then((port) => {

            res.send({
                Count: port._LikeCount + 1
            })
        })
        .catch(() => res.status(400));

}

//get dislikes
exports.portdisLIke = (req, res) => {


    PortModel.findByIdAndUpdate(req.body.POSTID, {
            $pull: {
                _Likes: req.user._id
            },
            $inc: {
                _LikeCount: -1
            }
        }).then((port) => {

            res.send({
                Count: port._LikeCount - 1
            })
        })
        .catch(() => res.status(400));

}



//get port Folio page

exports.portfolioPopular = (req, res) => {

    PortModel.find().sort({
        _LikeCount: -1
    }).populate([{
        path: '_Owner'
    }, {
        path: '_Comments',
        populate: {
            path: '_Owner',
            model: 'User'
        }
    }]).then((PortList) => {

        console.log(PortList);
        res.render('Portfolio', {
            portlist: PortList,

        });
    }).catch((error) => {
        console.log(error);
    });

}









exports.porfolioRecent = (req, res) => {


    PortModel.find().sort({
        _Date: -1
    }).populate([{
        path: '_Owner'
    }, {
        path: '_Comments',
        populate: {
            path: '_Owner',
            model: 'User'
        }
    }]).then((PortList) => {


        res.render('Portfolio', {
            portlist: PortList

        });
    }).catch((err) => console.log(err));
}
exports.search = (req, res) => {

    console.log(req.query.search)

    PortModel.find({
        '_Title': {
            $regex: `${req.query.search}`,
            $options: '/i/'
        }
    }).populate([{
        path: '_Owner'
    }, {
        path: '_Comments',
        populate: {
            path: '_Owner',
            model: 'User'
        }
    }]).then((PortList) => {


        res.render('Portfolio', {
            portlist: PortList

        });
    }).catch((err) => console.log(err));
}