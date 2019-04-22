const UserModel = require('../Models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser((user, done) => {

    done(null, user._id);

});

passport.deserializeUser((id, done) => {

    UserModel.findById(id, (err, user) => {
        done(err,user);
    });
});

passport.use('local', new LocalStrategy({
        usernameField: "EMAIL",
        passwordField: 'PASS',
        passReqToCallback: true
    },
    (req, EMAIL, PASS, done) => {
        
        UserModel.findOne({
                _Email: EMAIL
            })
            .then((user) => {
           
                if (!user) return done(null, false,req.flash('loginError',"User not found"));
                
                user.comparePassword(PASS,(err,Ismatch) => {
                    if (err) return done(err);
                      
                    if (!Ismatch) return done(null, false,req.flash('loginError',"password not match"));
                    done(null, user);
                });
            })
            .catch((error) => done(error));
    }
));