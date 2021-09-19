const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    console.log(req.headers);
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
};

module.exports = auth;
