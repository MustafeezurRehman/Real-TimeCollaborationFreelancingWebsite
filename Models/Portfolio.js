var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PortfolioSchema = new Schema({

    _Title: {
        type: String
    },
    _Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Date: {
        type: Date,
        default: Date.now()
    },
    _Desc: {
        type: String
    },
    _Picture: {
        _FileName: {
            type: String
        },
        _path: {
            type: String,
            default: '/user/portfolio/'
        }
    },
    _Likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    _LikeCount: {
        type: Number,
        default: 0
    },
    _Comments: [{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }]
});

var PortfolioModel = mongoose.model('Portfolio', PortfolioSchema);
module.exports = PortfolioModel;