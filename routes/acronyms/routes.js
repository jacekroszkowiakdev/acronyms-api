const express = require("express");
const router = express.Router();
const Acronym = require("../../models/acronym");
const Users = require("../../models/users");
const hydrate = require("../hydrate");
const {
    createAcronym,
    getAcronym,
    listAcronyms,
    paginateAcronyms,
    updateDefinition,
    deleteAcronym,
} = require("./selectors");

// get single entry helper
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

// hydrate DB
router.get("/hydrate", async (req, res) => {
    try {
        await hydrate();
        res.status(200).json({ message: "DB hydrated!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /acronym
router.post("/", async (req, res) => {
    try {
        const newAcronymEntry = await createAcronym(
            req.body.acronym,
            req.body.fullForm
        );
        res.status(201).json(newAcronymEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /
router.get("/", async (req, res) => {
    try {
        const acronyms = await listAcronyms();
        res.json(acronyms);
        res.status(200).json({ message: "all entries downloaded" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /:acronym
router.get("/:acronym", getEntry, async (req, res) => {
    await res.send(res.acronym);
});

// GET /acronym?from=50&limit=10&search=:search
// ▶ returns a list of acronyms, paginated using query parameters
// ▶ response headers indicate if there are more results
// ▶ returns all acronyms that fuzzy match against :search
// router.get("/acronym?", async (req, res) => {
router.get("/list/acronym", async (req, res) => {
    let limit = parseInt(req.query.limit);
    let startIdex = parseInt(req.query.from);
    let endIdex = parseInt(req.query.from + limit);
    let searchQuery = req.query.search;
    fuzzySearch = searchQuery;

    try {
        console.log(req.params);
        console.log(limit);
        console.log(startIdex);
        console.log(endIdex);
        console.log(searchQuery);
        const acronyms = await Acronym.find()
            .sort(searchQuery, 1)
            .skip(startIdex)
            .limit(limit)
            .exec()
            .next();
        res.json(acronyms);
        res.status(200).json({ message: "Search results paginated" });
        res.send("hello!");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /random/:count?
router.get("/random/:count?", async (req, res) => {
    try {
        let sampleSize = parseInt(req.query.sample);
        const randomAcronyms = await Acronym.aggregate([
            { $sample: { size: sampleSize } },
        ]);
        res.json(randomAcronyms);
        res.status(200).json({ message: "Random DB entries downloaded" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /:acronym
// ▶ receives an acronym and definition strings
// ▶ uses an authorization header to ensure acronyms are protected
// ▶ updates the acronym definition to the db for :acronym
router.put("/:acronym", getEntry, async (req, res) => {
    let entry;
    try {
        entry = await updateDefinition(req.params, req.body);
        if (entry === null) {
            return res
                .status(404)
                .json({ message: "Entry does not exists in DB" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.send("Acronym definition updated");
});

// DELETE /:acronym
router.delete("/:acronym", async (req, res) => {
    let entry;
    try {
        entry = await deleteAcronym(req.params.acronym);
        if (entry === null) {
            return res
                .status(404)
                .json({ message: "Entry does not exists in DB" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.status(200).send("Acronym deleted");
});

module.exports = router;
