var CommentModel = require('../Models/Comment');
var PortFolioModel = require('../Models/Portfolio');
var mongoose = require('mongoose');

exports.postComment = (req, res) => {


    PortFolioModel.findById(mongoose.Types.ObjectId(req.body.PORTFOLIOID.toString())).then((portfolio) => {

        console.log(portfolio)
        var comment = new CommentModel({

            _Text: req.body.TEXT,
            _Owner: req.user

        })

        portfolio._Comments.push(comment);
        Promise.all([portfolio.save(), comment.save()]).catch((er) => {

            console.log(er);
        });

    })


}