var schedule = require('node-schedule');
var Model = require('../Models');

Model.findbyid(req.user._id).then((project) => {


    schedule.scheduleJob(project_Enddate, function () {

        project._Status = 'Closed';
        project.save();

    });
})