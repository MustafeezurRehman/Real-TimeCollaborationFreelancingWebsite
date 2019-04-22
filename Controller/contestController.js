const ContestModel = require('../Models/Contest');
const UserModel = require('../Models/User');
const mongoose = require('mongoose');


//get the contest brif page
exports.contestBrief = (req, res) => {

    ContestModel.findById(req.params.id).populate('_Owner').then((contest) => {
        if(!contest) return res.send('Route not Exist');
        res.render('ContestBrief', {
            contest: contest,
            date: Date.now()
        });
    }).catch((err) => {
        res.Status(404);
    })

}






exports.addContest = (req, res) => {

    res.render('AddContest', {
        error: req.flash('error'),
        success: req.flash('success')
    });

}






exports.postContest = (req, res) => {

    UserModel.findById(req.user._id).then((user) => {

        var contest = new ContestModel({
            _Title: req.body.TITLE,
            _Type: req.body.TYPE,
            _EndDate: Typecheck(req),
            _Owner: user,
            _Desc_Of_Org: req.body.DESCOFORG,
            _Industry: req.body.INDUSTRY,
            _Style: req.body.STYLE,
            _Inspiration: req.body.INSPIRATION,
            _ContentDesc: req.body.CONTENTDESC,
            _Other: req.body.OTHER,
            _Category:req.body.CATEGORY

        });
        if (contest._Type === 'Gold') contest._Price = 1200;
        if (contest._Type === 'Silver') contest._Price = 700;
        if (contest._Type === 'Basic') contest._Price = 400;



        user._Contest = contest;
        Promise.all([user.save(), contest.save()]).then(() => {

            req.flash('success', 'SuccessFly Added Contest');
            res.redirect('/addcontest');

        }).catch((err) => {
            console.log(err)
            req.flash('error', 'Some error happend');
            res.redirect('/addcontest');
        })


    }).catch((ee) => {
        console.log(ee)
        res.send('Send the Wrong User');
    })



}




function Typecheck(req) {
    var currentdate = new Date();
    console.log(currentdate);
    if (req.body.TYPE === 'Gold') {

        return currentdate.setDate(currentdate.getDate() + 12);
    }
    if (req.body.TYPE === 'Silver') {
        return currentdate.setDate(currentdate.getDate() + 6);
    }
    if (req.body.TYPE === 'Basic') {
        console.log(currentdate.setDate(currentdate.getDate() + 3))
        return currentdate.setDate(currentdate.getDate() + 3);
    }

}


//*****************
//Contest Design Section
//****************


exports.contestDesign = (req, res) => {
        ContestModel.findById(req.params.id).populate([{
                    path: '_Owner'
                },
                {
                    path: '_Design',
                    populate: {
                        path: '_Owner',
                        model: 'User'
                    }
                }
            ]).then((contest) => {
                if(!contest) return res.send('Route not Exist');
                
                
                res.render('contestDesign', {
                    contest: contest,
                    date: Date.now()
                });
                

            }).catch((err) => {

                res.send('Route not Exist');

            })

        }