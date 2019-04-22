var ContestModel = require('../Models/Contest');
var BidProModel = require('../Models/BidProject.js');
var mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_JRGHAN7cqptpRJ2MNVaGJklc');


exports.getPaymentPage = (req, res) => {

    res.redirect('/pay/90/21/32/ok')
}

exports.getpaypageReal = (req, res) => {
    console.log(req.body.AMOUNT);
    console.log('hello');
    res.render('Payment', {
        Type: req.body.TYPE,
        Project_id: req.body.PROJECTID,
        Amount: req.body.AMOUNT * 100

    });
}


exports.paid = (req, res) => {
console.log('here');

    if (req.body.TYPE === 'Project') {
        console.log('wrong');
        BidProModel.findOne({
                '_id': mongoose.Types.ObjectId(req.body.PROJECTID.toString()),
                '_Owner': req.user
            })
            .then((project) => {


                //
                stripe.customers.create({
                    email: req.body.stripeEmail,
                    source: req.body.stripeToken
                }).then((customer) => {
                    stripe.charges.create({
                            amount: Number(project._Price) * 100,
                            currency: "usd",
                            customer: customer.id


                        }).then((charge) => {

                            res.render('SuccessPage')
                            project._Payment = true;
                            project.save();
                        })
                        .catch((err) => {

                            console.log(err);

                        });

                });






                //
            }).catch((er) => {
                console.log(er);
            })


    }
    if (req.body.TYPE === 'Contest') {
        console.log('1')
        ContestModel.findOne({
                '_id': mongoose.Types.ObjectId(req.body.PROJECTID.toString()),
                '_Owner': req.user
            })
            .then((project) => {

                console.log('2')
                //
                stripe.customers.create({
                    email: req.body.stripeEmail,
                    source: req.body.stripeToken
                }).then((customer) => {
                    stripe.charges.create({
                            amount: Number(project._Price) * 100,
                            currency: "usd",
                            customer: customer.id


                        }).then((charge) => {
                            console.log('inside render')
                            res.render('SuccessPage')
                            project._Payment = true;
                            project.save();
                        })
                        .catch((err) => {

                            console.log(err);

                        });

                }).catch((ir) => {

                    console.log(ir)
                })






                //
            }).catch((er) => {
                console.log(er);
            })

    }

}