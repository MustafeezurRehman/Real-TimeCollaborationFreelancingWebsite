var NotificationModel = require('../Models/Notification');
var mongoose = require('mongoose');


exports.GetNotification = (req, res) => {

    NotificationModel.find({

        '_Receiver': req.user

    }).populate('_LastSender').sort({
        _CreatedAt: -1
    }).then((Notifications) => {

        res.render('notification', {
            user: req.user,
            notification: Notifications
        })
    })

}


exports.changeNotification = (req, res) => {

    NotificationModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.NOTIID.toString()), {
        $set: {
            '_IsRead': true
        }
    }).then((notification) => {
        res.redirect(notification._Link);
    });

}