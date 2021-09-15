require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const { auth } = require("express-openid-connect");

const config = {
    authRequired: false,
    auth0Logout: true,
    session: {
        cookie: {
            sameSite: "Lax",
        },
    },
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER,
};

// set up the DB
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("connected to DB"));

// Middleware
app.use(express.json());
app.use(auth(config));
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});
app.set("trust proxy", true);

const appRouter = require("./routes/acronyms/routes");
app.use("/", appRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
