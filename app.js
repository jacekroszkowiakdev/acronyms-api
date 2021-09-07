const express = require("express");
const app = express();
const port = 3000;

// Middleware
var createError = require("http-errors");

app.get("/", (req, res) => {
    res.send("I am a server!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
