const BidProModel = require('../Models/BidProject');
const BidModel = require('../Models/Bid');
const mongoose = require('mongoose');
const NotificationModel = require('../Models/Notification');


exports.addproject = (req, res) => {

    res.render('AddGigProject', {
        error: req.flash('error'),
        success: req.flash('success')
    });


}
exports.addprojectPost = (req, res) => {

    console.log(req.body.CATEGORY);
    var bidpro = new BidProModel({
        _Title: req.body.TITLE,
        _Price: req.body.PRICE,
        _ComDate: req.body.COMDATE,
        _Description: req.body.DESC,
        _Skills: req.body.SKILLS,
        _Owner: req.user._id,
        _Category: req.body.CATEGORY
    });

    bidpro.save().then(() => {
            req.flash('success', 'SuccessFly Added Project');
            res.redirect('/addproject');
        })
        .catch((ee) => {
            console.log(ee)
            req.flash('error', 'Some error happend');
            res.redirect('/addproject');
        })

}

exports.getproject = (req, res) => {

    BidProModel.findById(req.params.id).populate([{
        path: '_Bid',
        populate: {
            path: '_Owner',
            model: 'User'
        }
    }, {
        path: '_Owner'
    }]).then((project) => {

        if (!project) return res.send('Route not Exist');
        var date = Date.now();


        res.render('GetProject', {
            project: project,
            date: date,
            error: req.flash('BidError'),
            success: req.flash('BidSuccess')
        });

    }).catch((ee) => console.log(ee));


}


exports.postBid = (req, res) => {

    BidProModel.findById(req.body.PROJECTID).then((project) => {

        var bid = new BidModel({
            _BidPrice: req.body.BIDPRICE,
            _Owner: req.user._id,
            _Days: req.body.BIDDAYS
        });



        project._Bid.push(bid);
        Promise.all([project.save(), bid.save()]).then(() => {
            req.flash("BidSuccess", "Your Bid SuccessFly Added");
            res.redirect(`/project/${req.body.PROJECTID}`);



            //add notification
            if (project._Bid.length - 1 > 0) {

                NotificationModel.findOneAndUpdate({
                    '_Receiver': project._Owner,
                    '_Link': `/project/${req.body.PROJECTID}`
                }, {
                    $set: {
                        '_IsRead': false,
                        '_LastSender': req.user,
                        '_Title': ` and ${project._Bid.length-1} others Bids in your Project`
                    },
                    $push: {
                        _Sender: req.user._id
                    }
                }).then();



            } else {
                var notification = new NotificationModel({
                    _Title: 'add Bid in your Project',
                    _Link: `/project/${project._id}`,
                    _LastSender: req.user,
                    _Receiver: project._Owner

                })
                notification._Sender.push(req.user);
                notification.save()

            }







        }).catch((g) => {
            req.flash("BidError", "Some Error Happened");
            res.redirect(`/project/${req.body.PROJECTID}`);
            consoel.log(g);
        });

    })

}



//Assigned Project to Deleloper 

exports.AssignedProject = (req, res) => {

    var date = new Date();
    BidProModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.PROJECTID.toString()), {
        $set: {
            _Assigned: mongoose.Types.ObjectId(req.body.USERID.toString()),
            _Status: 'Assigned',
            _Price: Number(req.body.BIDPRICE),
            _ComDate: date.setDate(date.getDate() + Number(req.body.DAYS))
        }
    }).then(() => {

        req.flash(`BidSuccess", "Successly projecct Assigned ${req.body.USERNAME}`);
        res.redirect(`/project/${req.body.PROJECTID}`)

        var notification = new NotificationModel({
            _Title: 'assigned project to You',
            _LastSender: req.user,
            _Receiver: mongoose.Types.ObjectId(req.body.USERID.toString()),
            _Link: `/uploadproject/${req.body.PROJECTID}`
        });
        notification.save();
    })



}








//Delete the bid
exports.deletebid = (req, res) => {


    BidProModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.PROJECTID.toString()), {
        $pull: {
            _Bid: req.body.BIDID
        }
    }).then((p) => {

        BidModel.findByIdAndRemove(req.body.BIDID).then(() => {
                req.flash("BidSuccess", "Your Bid SuccessFly Deleted");
                res.redirect(`/project/${req.body.PROJECTID}`)
                NotificationModel.findOne({
                    '_Receiver': p._Owner
                }).then((notification) => {
                    if (notification._Sender.length > 1) {
                        notification._Sender.pull(req.user);
                        notification._LastSender = notification._Sender[notification._Sender.length - 1];
                        notification.save();
                    } else {
                        notification.remove();
                    }
                }).catch((errr) => {
                    console.log(errr);
                })

            })
            .catch((ee) => console.log(ee));

    }).catch((er) => console.log(er));



}


exports.uploadSubmitproject = (req, res) => {

    BidProModel.findOne({
        _id: mongoose.Types.ObjectId(req.params.id.toString()),

        _Assigned: req.user
    }).then((project) => {
        if (!project) return res.send('Wrong Route')
        res.render('WinProjectUpload', {
            project: project,
            error: req.flash('error'),
            success: req.flash('success')
        })

    })

}

exports.ReciveWinProject = (req, res) => {
    if (!req.file) {
        req.flash('error', "Please Upload file in Rar Format");
        res.redirect(`/uploadproject/${req.body.PROJECTID}`);
        return
    }
    BidProModel.findOne({
        _id: req.body.PROJECTID,
        _Status: 'Assigned',
        _Assigned: req.user
    }).then((project) => {
        if (!project) return res.send('Wrong Route')

        req.flash('success', "Upload Project Successfly");
        project._FinalFile = '/user/finalfiles/' + req.file.filename;
        project._Status = "Waiting"
        project.save();
        res.redirect(`/uploadproject/${req.body.PROJECTID}`);

        var notification = new NotificationModel({
            _Title: 'is Uploaded the Project Final File',
            _Link: `/winproject/finalfiles/${project._id}`,
            _Receiver: project._Owner,
            _LastSender: req.user

        })
        notification.save();
    })




}

exports.CheckFinalfiles = (req, res) => {
    BidProModel.findOne({
        _id: req.params.id,
        _Status: 'Waiting',
        _Owner: req.user,

    }).then((project) => {
        if (!project) return res.send('Wrong Route')

        if (project._Payment === false) return res.send('First Pay the Project Price');

        res.render('ProjectFinalFiles', {
            project: project
        });

    });
}



exports.projectsubmitreport = (req, res) => {
    if (req.body.FILE === 'CLEAR') {
        BidProModel.findOne({
            _id: req.body.PROJECTID,
            _Status: 'Waiting',
            _Owner: req.user
        }).populate('_Assigned').then((project) => {

            if (!project) return res.send('Wrong Route');

            project._Assigned._Balance += project._Price;

            var total = project._Assigned._ProjectCompleted;


            var rat = ((project._Assigned._Rating * (total * 5)) / 5);


            total = project._Assigned._ProjectCompleted + 1;
            var rating = rat + Number(req.body.RATING);
            project._Assigned._ProjectCompleted = total;
            project._Assigned._Rating = ((rating * 5) / (total * 5)).toFixed(1);
            project._Status = 'Closed'

            Promise.all([project._Assigned.save(), project.save()]).then().catch((er) => {

                console.log(er);
            })
            res.redirect('/');


            var notification = new NotificationModel({
                _Title: 'Project Prize Added into your Account',
                _Link: '/balance',
                _Receiver: project._Assigned._id,
                _LastSender: project._Owner
            })
            notification.save();


        })

    }
    if (req.body.FILE === 'NOTCLEAR') {

        BidProModel.findOne({
            _id: req.body.PROJECTID,
            _Status: 'Waiting',
            _Owner: req.user
        }).then((project) => {

            if (!project) return res.send('Wrong Route');

            var notification = new NotificationModel({
                _Title: 'Says you Not Uploaded the Right Files',
                _Link: `/uploadproject/${project._id}`,
                _Receiver: project._Assigned,
                _LastSender: req.user
            })
            project._Status = 'Assigned';
            Promise.all([project.save(), notification.save()]);
            res.redirect('/');



        })



    }
}