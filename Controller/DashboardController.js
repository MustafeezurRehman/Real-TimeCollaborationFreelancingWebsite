var BidProsModel = require('../Models/BidProject');
var ContestModel = require('../Models/Contest');



exports.GetDashboard = (req, res) => {



    BidProsModel.find({
        $or:[{'_Owner': req.user},
        {
            '_Assigned':req.user
        }]
    }).then((projects) => {

        ContestModel.find({
            $or:[{'_Owner': req.user},
            {
                '_Winner':req.user
            }]
        }).then((contests) => {

            
            res.render('Dashboard', {
                user:req.user,
                contests: contests,
                projects: projects

            });

        })

    })





}