var passport = require('passport');



exports.login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
});

exports.logout = (req, res) => {
    console.log('heer');
    req.logout();
 
    res.redirect('/login');

}