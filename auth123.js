const express = require("express");
const bodyParser = require("body-parser");
const Users = require("../../models/users");
const jwt = require("jsonwebtoken");
const app = express();
const accessTokenSecret = "brzeczyszczykiewicz";
const refreshTokenSecret = "grzegorz";

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("connected to users DB"));

const users = [
    {
        username: "admin",
        password: "password123admin",
        role: "admin",
    },
    {
        username: "regularUser",
        password: "password123member",
        role: "member",
    },
];

let refreshTokens = [];

app.use(express.json());

app.post("/login", (req, res) => {
    // read username and password from request body
    const { username, password } = req.body;

    // filter user from the users array by username and password
    const user = users.find((u) => {
        return u.username === username && u.password === password;
    });

    if (user) {
        // generate an access token
        const accessToken = jwt.sign(
            { username: user.username, role: user.role },
            accessTokenSecret,
            { expiresIn: "20m" }
        );
        const refreshToken = jwt.sign(
            { username: user.username, role: user.role },
            refreshTokenSecret
        );

        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken,
        });
    } else {
        res.send("Username or password incorrect");
    }
});

app.post("/token", (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
            { username: user.username, role: user.role },
            accessTokenSecret,
            { expiresIn: "20m" }
        );

        res.json({
            accessToken,
        });
    });
});

app.post("/logout", (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter((t) => t !== token);

    res.send("Logout successful");
});

app.listen(3000, () => {
    console.log("Authentication service started on port 3000");
});
