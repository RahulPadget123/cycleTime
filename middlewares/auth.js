const jwt = require('jsonwebtoken');

async function isLoggedIn(req, res, next) {
    if (req.cookies.token === "") {
        return res.redirect("/");
    } else {
        let data = jwt.verify(req.cookies.token, "secret");
        req.user = data;
        next();
    }
}

async function isChecked(req, res, next) {
    if (req.cookies.token === "") {
        return res.redirect("/");
    } else {
        let data = jwt.verify(req.cookies.token, "hello");
        req.user = data;
        next();
    }

}


module.exports = {
    isLoggedIn,
    isChecked,
}
