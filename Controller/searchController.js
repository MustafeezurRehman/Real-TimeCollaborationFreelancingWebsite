var ProBidModel = require('../Models/BidProject');
var ContestModel = require('../Models/Contest');


exports.getProject = (req, res) => {

    ProBidModel.find().then((projects) => {

            res.render('searchProject', {
                projects: projects,
                date: Date.now()
            });
        })
        .catch((err) => {
            res.send('Some Error');
        });

}

exports.getContest = (req, res) => {
    ContestModel.find().then((contests) => {
            res.render('searchContest', {
                contests: contests,
                date: Date.now()
            });

        })
        .catch((err) => {
            res.send('Some Error');
        });
}

exports.searchContest = (req, res) => {


    ContestModel.find({
        $or: [{
                '_Title': {
                    $regex: `${req.query.search}`,
                    $options: '/i/'
                }
            },
            {
                '_Category': {
                    $regex: `${req.query.search}`,
                    $options: '/i/'
                }
            }

        ]
    }).then((contests) => {

        res.render('searchContest', {
            contests: contests,
            date: Date.now()
        })
    })

}
exports.searchProject = (req, res) => {


    ProBidModel.find({
        $or: [{
                '_Title': {
                    $regex: `${req.query.search}`,
                    $options: '/i/'
                }
            },
            {
                '_Skills': {
                    $regex: `${req.query.search}`,
                    $options: '/i/'
                }
            },
            {
                '_Category': {
                    $regex: `${req.query.search}`,
                    $options: '/i/'
                }
            }
        ]
    }).then((projects) => {

        res.render('searchProject', {
            projects: projects,
            date: Date.now()
        })
    })

}