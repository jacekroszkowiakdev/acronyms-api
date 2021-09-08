const mongoose = require("mongoose");

const acronymSchema = new mongoose.Schema({
    acronym: {
        type: String,
        required: true,
    },
    fullForm: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("acronym", acronymSchema);
