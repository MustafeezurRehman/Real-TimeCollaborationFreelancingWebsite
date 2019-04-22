var io = require('../start').io;
var MessageModel = require('../Models/Message');
var UserModel = require('../Models/User');
var mongoose = require('mongoose');
exports.chat = (req, res) => {

    if(req.params.id.toString()===req.user._id.toString())
    {
        return res.redirect(`/userid/${req.user._id}`);
    }
    UserModel.findById(mongoose.Types.ObjectId(req.params.id.toString())).then((User) => {

        MessageModel.find({

                    $or: [{

                            $and: [{
                                '_Receiver': req.user._id
                            }, {
                                '_Sender': req.params.id
                            }]
                        },
                        {
                            $and: [{
                                    '_Sender': req.user._id
                                },
                                {
                                    '_Receiver': req.params.id
                                }
                            ]
                        }
                    ]
                }

            )
            .then((Message) => {



                res.render('chat', {
                    Message: Message,
                    User: User
                });
                MessageModel.update({
                    '_Receiver': req.user._id,
                    '_IsRead': false
                }, {
                    $set: {
                        _IsRead: true
                    }
                }).then(() => {}).catch();
            })
    }).catch((err) => {
        console.log(err);
        res.send('Wrong Sender ID');
    });



}

exports.postMessage = (req, res) => {


    var Message = new MessageModel({
        _Message: req.body.MESSAGE,
        _Sender: req.user,
        _Receiver: req.body.RECEIVERID,
        _RName: req.body.RECEIVERNAME,
        _SName: req.user._FirstName + req.user._LastName,
        _RPic: req.body.RECEIVERPIC,
        _SPic: req.user._ProfilePic.path + req.user._ProfilePic._FileName
    });

    Message.save().then(() => {
        res.redirect(`/userid/${req.body.RECEIVERID}`);

    }).catch(() => {

        res.send('Something Wrong');
    })


}


exports.markread = (req, res) => {
    MessageModel.findOneAndUpdate({
        '_Receiver': req.body.RECEIVERID
    }, {
        $set: {
            _IsRead: true

        }
    }).then().catch((err) => {

        console.log(err);
    })

}