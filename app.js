require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

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
app.use(express.urlencoded({ extended: true }));

const appRouter = require("./routes/acronyms/routes");
app.use("/", appRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
