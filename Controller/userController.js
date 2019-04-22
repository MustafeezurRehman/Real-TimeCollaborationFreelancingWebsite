const UserModel = require('../Models/User');
const PortModel = require('../Models/Portfolio');


exports.Loginform = (req, res) => {


    res.render('Login', {
        error: req.flash('loginError')
    });
}

exports.RegisterForm = (req, res) => {

    res.render('SignUp');
}

exports.Rejister = (req, res) => {

    var user = new UserModel({
        _FirstName: req.body.FIRSTNAME,
        _LastName: req.body.LASTNAME,
        _Email: req.body.EMAIL,
        _Type: req.body.USERTYPE,
        _Password: req.body.PASS
    });
    user.save()
        .then(() => res.redirect('/'))
        .catch(() => res.redirect('/signup'));
}


//edit profile

exports.editprofile = (req, res) => {



    res.render('editprofile', {
        error: req.flash('error'),
        success: req.flash('success'),
        currentUser: req.user
    });

}

exports.updateprofile = (req, res) => {

    UserModel.findByIdAndUpdate(req.user._id, {
        _FirstName: req.body.FIRSTNAME,
        _LastName: req.body.LASTNAME,
        _Email: req.body.EMAIL,
        _Location: req.body.LOCATION,
        _Education: req.body.EDUCATION,
        _Description: req.body.DESC,
        _Facebook: req.body.FACEBOOK,
        _Twitter: req.body.TWITTER,
        _Google: req.body.GOOGLE,
        _Mobile: req.body.MOBILE,

    }).then(() => {


        req.flash('success', "Field Updated");
        res.redirect('/user/editprofile');
    }).catch(() => {
        req.flash('error', "Error Field is not updated");
        res.redirect('/user/editprofile');
    })

}
exports.updatepic = (req, res) => {
    if (!req.file) {

        req.flash('error', "please First select Right File Then Upload it");
        return res.redirect('/user/editprofile');
    }
    console.log(req.file);
    UserModel.findByIdAndUpdate(req.user._id, {
        _ProfilePic: {
            _FileName: req.file.filename
        }
    }).then(() => {
        req.flash('success', "Profile Picture Updated");
        res.redirect('/user/editprofile');
    }).catch(() => {
        req.flash('error', "Error picture not Udate");
        res.redirect('/user/editprofile');
    })
}

exports.changePasswordget = (req, res) => {
    res.render('changepassword', {
        error: req.flash('error'),
        success: req.flash('success')
    });
}
exports.changePasswordPost = (req, res) => {

    if (req.body.PASS1 !== req.body.PASS2) {
        req.flash('error', 'Password Does Not Matched with Upper Field');
        return res.redirect('/user/changepassword');
    }

    UserModel.findById(req.user._id)
        .then((user) => {
            user._Password = req.body.PASS1;
            user.save();
            req.flash('success', "Change Password SuccesFully");
            res.redirect('/user/changepassword');
        })
        .catch(() => {
            req.flash('error', "cannot changed the password");
            res.redirect('/user/changepassword');
        })

}


//user profile controller

exports.profile = (req, res) => {

    UserModel.findById(req.params.id).populate('_Portfolio').then((user) => {
        if (!user) return res.send('Route not Exist');
        res.render('Profile', {
            user: user
        });
    }).catch(() => res.send('User Not FOusnd'));
}

exports.search = (req, res) =>

    {
        UserModel.find({
            $or: [{
                    '_FirstName': {
                        $regex: `${req.query.search}`,
                        $options: '/i/'
                    }
                },
                {
                    '_LastName': {
                        $regex: `${req.query.search}`,
                        $options: '/i/'

                    }
                }


            ]
        }).then((UserList) => {


            res.render('SearchUser', {
                Users: UserList

            });
        }).catch((err) => console.log(err));




    }

exports.balance = (req, res) => {

    UserModel.findById(req.user._id).then((user) => {

        res.render('Balance', {
            user: user
        })

    })


}