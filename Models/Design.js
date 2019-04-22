var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DesginSchema = new Schema({

    _Image: {
        _FileName: {
            type: String
        },
        _Path: {
            type: String,
            default: '/contest/design/'
        }
    },
    _Desc: {
        type: String
    },
    _Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _Rating: {
        type: String
    },
    _ContestId:{
        type: Schema.Types.ObjectId,
        ref: 'Contest'

    }
});

var DesignModel = mongoose.model('Design', DesginSchema);
module.exports = DesignModel;