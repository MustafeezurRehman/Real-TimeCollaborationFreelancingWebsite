const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _FirstName: {
        type: String
    },
    _LastName: {
        type: String
    },
    _Balance: {
        type: Number,
        default: 0
    },
    _ProfilePic: {
        _FileName: {
            type: String
        },
        path: {
            type: String,
            default: '/user/profile-pic/'
        }
    },
    _Email: {
        type: String,
        unique: true,
        trim: true
    },
    _Portfolio: [{
        type: Schema.Types.ObjectId,
        ref: 'Portfolio'
    }],
    _Contest: {
        type: Schema.Types.ObjectId,
        ref: 'Contest'
    },
    _ProjectCompleted: {
        type: Number,
        default:0
    },
    _Rating: {
        type: Number,
    },
    _Password: {
        type: String,
    },
    _Type: {
        type: String,
    },
    _Location: {
        type: String,
    },
    _Education: {
        type: String,
    },
    _Description: {
        type: String,
    },
    _Facebook: {
        type: String,
    },
    _Twitter: {
        type: String,
    },
    _Google: {
        type: String,
    },
    _Mobile: {
        type: String,
    }
});



UserSchema.pre('save', function (next) {

    var user = this;

    if (!user.isModified('_Password')) next();
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user._Password, salt, (err, hash) => {
            user._Password = hash;
            next();
        });
    });

});


UserSchema.methods.comparePassword = function (temp_pass, callback) {

    var user = this;
    bcrypt.compare(temp_pass, user._Password, (err, ismatch) => {


        if (err) return callback(err);

        callback(null, ismatch);

    });
}


const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;