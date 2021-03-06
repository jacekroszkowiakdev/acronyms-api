const Acronym = require("../../models/acronym");
const User = require("../../models/users");

module.exports.getAcronym = async (acronymPrefix) =>
    await Acronym.findOne({ acronym: acronymPrefix });

module.exports.listAcronyms = async (query) =>
    query === undefined
        ? await Acronym.find()
        : await Acronym.find({ acronym: query });

module.exports.getPaginatedResults = async (acronymPrefix, startIdx, sample) =>
    await Acronym.find({ acronym: acronymPrefix }).skip(startIdx).limit(sample);

module.exports.createAcronym = async (acronym, fullForm) => {
    const entry = new Acronym({
        acronym,
        fullForm,
    });
    await entry.save();
    return entry;
};

module.exports.getRandom = async (sample) =>
    await Acronym.aggregate([{ $sample: { size: sample } }]);

module.exports.updateDefinition = async (acronymPrefix, newDefinition) =>
    await Acronym.findOneAndUpdate(acronymPrefix, newDefinition);

module.exports.deleteAcronym = async (acronymString) =>
    await Acronym.deleteMany({ acronym: acronymString });

module.exports.createUser = async (username, password, role) => {
    const entry = new User({
        username,
        password,
        role,
    });
    await entry.save();
    return entry;
};

module.exports.getUser = async (userLogin) =>
    await User.findOne({ username: userLogin });
