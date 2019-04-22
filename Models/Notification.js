var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NotificationSchema = new Schema({
    _Title: {
        type: String
    },
    _Link: {
        type: String
    },
    _Sender: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    _Receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _IsRead: {
        type: Boolean,
        default: false

    },
    _LastSender: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
    _CreatedAt: {
        type: Date,
        default: Date.now()
    }

});

var NotificationModel = mongoose.model('Notification', NotificationSchema);

module.exports = NotificationModel;