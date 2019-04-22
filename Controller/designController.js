const DesignModel = require('../Models/Design');
const ContestModel = require('../Models/Contest');
const NotificationModel = require('../Models/Notification');
const mongoose = require('mongoose');
var stripe = require('stripe')('sk_test_JRGHAN7cqptpRJ2MNVaGJklc')










exports.postDesign = (req, res) => {
    if (!req.file) {
        res.send('Please upload the right file');
        return
    }

    ContestModel.findOne({
        '_id': req.body.CONTESTID.toString(),
        '_Status': 'Open'
    }).then((contest) => {

        var design = new DesignModel({
            _Image: {
                _FileName: req.file.filename
            },
            _Owner: req.user,
            _Desc: req.body.DESC,
            _ContestId: contest._id
        });

        contest._Design.push(design);

        Promise.all([design.save(), contest.save()]).then(() => {

            res.redirect(`/contestdesign/${req.body.CONTESTID}`);
            if (contest._Design.length - 1 > 0) {
                NotificationModel.findOneAndUpdate({
                    '_Receiver': contest._Owner,
                    '_Link': `/contestdesign/${contest._id}`
                }, {
                    $set: {
                        '_IsRead': false,
                        '_LastSender': req.user,
                        '_Title': ` and ${contest._Design.length-1} others Submits designs in your Project`
                    },
                    $push: {
                        _Sender: req.user._id
                    }
                }).then();

            } else {
                var notification = new NotificationModel({

                    _Title: 'Submit Design in your Contest',
                    _Receiver: contest._Owner,
                    _LastSender: req.user,
                    _Link: `/contestdesign/${contest._id}`

                });
                notification._Sender.push(req.user._id);
                notification.save();
            }


        }).catch((err) => {
            console.log(err);
        });

    }).catch((er) => {
        console.log(er)
        res.send('Route not exist');
    })


}



//postRating
//**********/

exports.postrating = (req, res) => {

    DesignModel.findByIdAndUpdate(req.body.DESIGNID, {
        $set: {
            _Rating: req.body.RATING
        }

    }).then((design) => {

        res.status(200);
        NotificationModel.findOne({
            '_Link': `/selectdesign/${design._id}`,
            '_Receiver': design._Owner
        }).then((Notification) => {
            console.log(Notification);
            if (Notification) {
                Notification._Title = "Change Rating in your Submitted Design";
                Notification._IsRead = false;
                Notification.save();

            } else {
                var notification = new NotificationModel({
                    _Title: `Give Rating in Your Submitted Design`,
                    _Receiver: design._Owner,
                    _LastSender: req.user,
                    _Link: `/selectdesign/${design._id}`
                })
                notification.save();
            }


        }).catch((r) => {
            console.log(r)
        })




    }).catch((err) => {

        console.log(err);
        res.send(404);

    });


}

exports.designselect = (req, res) => {

    DesignModel.findById(mongoose.Types.ObjectId(req.params.id.toString())).then((design) => {


        if (!design) return res.send('Routes not Exist');

        res.render('SelectContest', {
            Design: design
        });


    }).catch((err) => {
        res.send('some thing wrong with routes');
    })

}


exports.winnerDesign = (req, res) => {

    ContestModel.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.body.CONTESTID.toString()),
        _Status: 'Open'
    }, {
        $set: {
            _Winner: mongoose.Types.ObjectId(req.body.DESIGNOWNER.toString()),
            _WinDesign: mongoose.Types.ObjectId(req.body.DESIGNID.toString()),
            _Status: 'Finished'
        }
    }).then((contest) => {

        if (!contest) return res.send('Credential are incorrect');
        res.redirect(`/contestdesign/${req.body.CONTESTID}`)

        var notification = new NotificationModel({
            _Title: 'Selected Your Winner In contest',
            _Link: `/windesign/${req.body.DESIGNID}`,
            _Receiver: mongoose.Types.ObjectId(req.body.DESIGNOWNER.toString()),
            _LastSender: contest._Owner
        })
        notification.save();

    }).catch((er) => {
        console.log(er);
    })



}



//win design
exports.windesign = (req, res) => {


    DesignModel.findById(req.params.id).then((design) => {

        if (!design) return res.send(' Route not Exist');
        res.render('WinDesignUpload', {
            Design: design,
            error: req.flash('error'),
            success: req.flash('success')
        })

    })



}


exports.receiveFinalfiles = (req, res) => {

    if (!req.file) {
        req.flash('error', "Please Upload file in Rar Format");
        res.redirect(`/uploadproject/${req.body.DESIGNID}`);
        return
    }
    ContestModel.findOne({
        '_WinDesign': req.body.DESIGNID
    }).then((contest) => {

        if (!contest) return res.send(' Route not Exist');

        contest._FinalFile = '/user/finalfiles/' + req.file.filename
        contest.save();
        req.flash('success', "Add File Successfly");
        res.redirect(`/windesign/${req.body.DESIGNID}`);

        var notification = new NotificationModel({
            _Title: 'is Uploaded the Final File',
            _Link: `/windesign/finalfiles/${contest._id}`,
            _Receiver: contest._Owner,
            _LastSender: req.user

        })
        notification.save();






    })


}


exports.OwnerReceiveFinalfiles = (req, res) => {


    ContestModel.findOne({
        _id: req.params.id,
        _Status: 'Finished',
        _Owner: req.user
    }).then((contest) => {
        if (!contest) return res.send('Wrong Route');

        res.render('FinalFiles', {
            contest: contest
        })


    })




}




exports.Submitdesignreport = (req, res) => {


    if (req.body.FILE === 'CLEAR') {

        ContestModel.findOne({
            _id: req.body.CONTESTID,
            _Status: 'Finished',
            _Owner: req.user
        }).populate([{
            path: '_Winner'
        }, {
            path: ' _WinDesign'
        }]).then((contest) => {

            contest._Winner._Balance += contest._Price;

            var total = contest._Winner._ProjectCompleted;

            console.log(contest._Winner._Rating * total);
            var rat = ((contest._Winner._Rating * (total * 5)) / 5);

            console.log(rat);
            total = contest._Winner._ProjectCompleted + 1;
            var rating = rat + Number(req.body.RATING);
            contest._Winner._ProjectCompleted = total;
            contest._Winner._Rating = ((rating * 5) / (total * 5)).toFixed(1);
            contest._Status = 'Closed'

            Promise.all([contest._Winner.save(), contest.save()]).then().catch((er) => {

                console.log(er);
            })


            res.redirect('/');

            var notification = new NotificationModel({
                _Title: 'Winning Contest Prize Added into your Account',
                _Link: '/balance',
                _Receiver: contest._Winner._id,
                _LastSender: contest._Owner
            })
            notification.save();
        })

    }
    if (req.body.FILE === 'NOTCLEAR') {

        var notification = new NotificationModel({
            _Title: 'Says you Not Uploaded the Right Files',
            _Link: `/windesign/${req.body.DESIGNID}`,
            _Receiver: req.body.WINNER,
            _LastSender: req.user
        })
        notification.save();
        res.redirect('/');



    }

}