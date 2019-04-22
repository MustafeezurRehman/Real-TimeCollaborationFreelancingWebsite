const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const body_parser = require('body-parser');
const flash = require('connect-flash');
const MessageModel = require('./Models/Message');
const moment = require('moment');
const NotificationModel = require('./Models/Notification');
const monoose = require('mongoose');


require('./Middleware/passport_auth');

//setting up template engine
app.set('view engine', 'ejs');

//*************************************/
//series of middleware started form here
//static file for users
app.use('/user/profile-pic/', express.static(__dirname + ('/Public/users/profile-pics')));
app.use('/user/portfolio/', express.static(__dirname + ('/Public/users/Portfolio-pics')));
app.use('/contest/design', express.static(__dirname + ('/Public/users/Contest')));
app.use('/user/finalfiles/',express.static(__dirname + ('/Public/users/FinalFiles')))

//static files
app.use('/css', express.static(__dirname + ('/Public/css')));
app.use('/js', express.static(__dirname + ('/Public/js')));
app.use('/images', express.static(__dirname + ('/Public/Images')));
app.use('/audio', express.static(__dirname + ('/Public/audio')));



//bodyparser
app.use(body_parser.urlencoded({
    extended: false
}));
app.use(body_parser.json());

//express session Authentication
//helps us to flash massages

app.use(session({
    secret: "hiresecret",
    key: "key",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: monoose.connection
    })
}));

//passport for auth
app.use(passport.initialize());
app.use(passport.session());


//for flash massages
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.helper = moment;
    res.locals.url = req.url;
    if (req.user) {
        MessageModel.find({
                '_Receiver': req.user._id,
                _IsRead: false
            })
            .then((Message) => {
                NotificationModel.find({
                    '_Receiver': req.user,
                    '_IsRead':false
                }).countDocuments().then((count) => {
                    res.locals.Msg = Message;
                    res.locals.Notify = count;
                    next();
                })

            })
    } else {
        next();
    }
})
//all routes
app.use(require("./routes/Routes"));




module.exports = app;