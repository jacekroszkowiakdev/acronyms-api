const mongoose = require("mongoose");
const Acronym = require("../models/acronym");
const data = require("../acronyms.json");

// refactor to async await
const countEntries = async () => {
    return new Promise((resolve, reject) => {
        Acronym.countDocuments((err, count) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(count);
        });
    });
};

const hydrate = async () => {
    const entries = await countEntries();
    if (entries) {
        throw new Error("entry exists");
    }
    data.forEach((elem) => {
        const acronym = Object.keys(elem)[0];
        const fullForm = elem[acronym];
        const acronymEntry = new Acronym({ acronym, fullForm });
        acronymEntry.save((err, record) => {
            if (err) {
                console.log("error :", err);
            }
        });
    });
};

module.exports = hydrate;
