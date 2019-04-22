exports.IsLogin = (req, res, next) => {

    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }

}


exports.StrickLoginsignup = (req, res, next) => {


    if (req.user) {
        if (req.url === '/login' || req.url === '/signup') {
            res.redirect('/')
        }
    } else {
        next();
    }


}

exports.allowCustomer = (req, res, next) => {

    if (req.user._Type === 'Customer') {

        next();
    }
    if (req.user._Type === 'Developer') {

        res.send('This route is not for Developer');

    }
}
exports.allowDeveloper = (req, res, next) => {

    if (req.user._Type === 'Developer') {

        next();
    }
    if (req.user._Type === 'Customer') {

        res.send('This route is not for Customer');

    }

}