const { getAcronym } = require("./selectors");

const getEntry = async (req, res, next) => {
    let entry;
    try {
        entry = await getAcronym(req.params.acronym);
        if (entry === null) {
            return res.status(404).json({ message: "Entry does not exists" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.acronym = entry;
    next();
};

module.exports = getEntry;
