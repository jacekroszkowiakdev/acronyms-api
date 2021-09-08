require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

// set up the DB
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("connected to DB"));

// Middleware
const createError = require("http-errors");
const debug = require("debug");
app.use(express.json());

// routes:

app.get("/", (req, res) => {
    res.send("I am a server!");
});

const appRouter = require("./routes/acronyms");
app.use("/acronyms", appRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
