const Acronym = require("../../models/acronym");

module.exports.listAcronyms = async (acronymPrefix) =>
    await Acronym.find({ acronym: acronymPrefix });

module.exports.createAcronym = async (acronym, fullForm) => {
    const entry = new Acronym({
        acronym,
        fullForm,
    });
    await entry.save();
    return entry;
};

module.exports.deleteAcronym = async (acronymString) =>
    await Acronym.findOneAndDelete({ acronym: acronymString });
