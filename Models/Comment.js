var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    _Text: {
        type: String
    },
    _Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

var CommentModel = mongoose.model('Comment', CommentSchema);
module.exports = CommentModel;