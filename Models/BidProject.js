var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BidProSchema = new Schema({

    _Title: {
        type: String,
        required: true
    },
    _Price: {
        type: Number,
        required: true
    },
    _ComDate: {
        type: Date
    },
    _Payment: {
        type: Boolean,
        default: false
    },
    _Date: {
        type: Date,
        default: Date.now()
    },
    _FinalFile: {
        type: String
    },
    _Description: {
        type: String
    },
    _Status: {
        type: String,
        default: 'Open'
    },
    _Skills: {
        type: String
    },
    _Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Bid: [{
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    }],
    _Assigned: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Category:{
        type:String
    }
});

var BidProModel = mongoose.model('BidPro', BidProSchema);
module.exports = BidProModel;