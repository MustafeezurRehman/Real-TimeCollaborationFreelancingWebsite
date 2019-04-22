var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ContestSchema = new Schema({

    _Title: {
        type: String,
        required: true
    },
    _Type: {
        type: String
    },
    _Payment: {
        type: Boolean,
        default: false
    },
    _Status: {
        type: String,
        default: 'Open'
    },
    _PDate: {
        type: Date,
        default: Date.now()
    },
    _EndDate: {
        type: Date,
        required: true
    },
    _Price: {
        type: Number
    },
    //Owner
    _Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
    /****************/
    //background Information

    _Desc_Of_Org: {
        type: String
    },
    _Industry: {
        type: String,
        required: true
    },

    /*********** */
    //Visual Style
    _Style: {
        type: String
    },
    _Inspiration: {
        type: String
    },
    _ContentDesc: {
        type: String,
        required: true
    },
    //************* */
    //Others
    _Other: {
        type: String
    },
    _Design: [{
        type: Schema.Types.ObjectId,
        ref: 'Design'
    }],
    _Winner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        trim: true
    },
    _Category: {
        type: String
    },

    _WinDesign: {
        type: Schema.Types.ObjectId,
        ref: 'Design',
        trim: true
    },
    _FinalFile: {
        type: String
    }

});

var ContestModel = mongoose.model('Contest', ContestSchema);
module.exports = ContestModel;