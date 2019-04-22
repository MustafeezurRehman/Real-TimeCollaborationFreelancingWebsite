var mongoose = require('mongoose');
var BidProModel=require('../Models/BidProject');
var Schema = mongoose.Schema;
var BidSchema = new Schema({

    _BidPrice: {
        type: Number,
        require: true,
        default: 0
    },
    _Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Days: {
        type: Number
    },
    _Date: {
        type: Date,
        default: Date.now()
    }
    
});

var BidModel = mongoose.model('Bid', BidSchema);


module.exports = BidModel;