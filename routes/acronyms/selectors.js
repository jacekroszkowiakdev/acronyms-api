const Acronym = require("../../models/acronym");

module.exports.getAcronym = async (acronymPrefix) =>
    await Acronym.findOne({ acronym: acronymPrefix });

module.exports.listAcronyms = async () => await Acronym.find();

module.exports.paginateAcronyms = async (acronymPrefix) =>
    await Acronym.find({ acronym: acronymPrefix });

module.exports.createAcronym = async (acronym, fullForm) => {
    const entry = new Acronym({
        acronym,
        fullForm,
    });
    await entry.save();
    return entry;
};

module.exports.updateDefinition = async (acronymPrefix, newDefinition) => {
    await Acronym.findOneAndUpdate(acronymPrefix, newDefinition);
};

module.exports.deleteAcronym = async (acronymString) =>
    await Acronym.findOneAndDelete({ acronym: acronymString });
