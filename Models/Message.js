var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var MessageSchema=new Schema({
    _Message:{
        type:String
    },
    _Sender:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    _Receiver:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    _CreatedAt:{
        type:Date,
        default:Date.now()
    },
    _IsRead:{
        type:Boolean,
        default:false
    },
    _RName:{
        type:String
    },
    _RPic:{
        type:String
    },
    _SPic:{
        type:String
    },
    _SName:{
        type:String
    }
});

var MessageModel=mongoose.model('Message',MessageSchema);
module.exports=MessageModel;