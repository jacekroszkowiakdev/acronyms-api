const express = require("express");
const router = express.Router();
const Acronym = require("../models/acronym");
const hydrate = require("./hydrate");

// get single entry helper
const getEntry = async (req, res) => {
    let entry;
    console.log(req);
    try {
        entry = await Acronym.find({}, { acronym: `${req.params.acronym}` });
        console.log(req.params.acronym);
        if (!entry) {
            return res.status(404).json({ message: "Entry does not exists" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.send(entry);
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

// get all entries
router.get("/", async (req, res) => {
    try {
        const acronyms = await Acronym.find();
        res.json(acronyms);
        res.status(200).json({ message: "all entries downloaded" });
        console.log("all entries downloaded");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /acronym?from=50&limit=10&search=:search
// ▶ returns a list of acronyms, paginated using query parameters
// ▶ response headers indicate if there are more results
// ▶ returns all acronyms that fuzzy match against :search
router.get("/acronym?from=50&limit=10&search=:search", (req, res) => {
    // try {
    //     const acronyms = await Acronym.find();
    //     res.json(acronyms);
    //     res.status(200).json({ message: "paginated" });
    // } catch (err) {
    //     res.status(500).json({ message: err.message });
    // }
});

// GET /acronym/:acronym
// ▶ returns the acronym and definition matching :acronym
router.get("/acronym/:acronym", getEntry);

// GET /random/:count?
// ▶ returns :count random acronyms
// ▶ the acronyms returned should not be adjacent rows from the data
router.get("/random/:count?", (req, res) => {
    res.send("get random count");
});

// POST /acronym
// ▶ receives an acronym and definition strings
// ▶ adds the acronym definition to the db
router.post("/acronym", (req, res) => {
    const newAcronymEntry = new Acronym({
        acronym: req.body.acronym,
        fullForm: req.body.fullForm,
    });
    try {
        const newAcronym = newAcronymEntry.save();
        res.status(201).json(newAcronym);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /acronym/:acronym
// ▶ receives an acronym and definition strings
// ▶ uses an authorization header to ensure acronyms are protected
// ▶ updates the acronym definition to the db for :acronym
router.patch("/acronym/:acronym", getEntry, (req, res) => {
    const newAcronymEntry = new Acronym({
        acronym: req.body.acronym,
        fullForm: req.body.fullForm,
    });
    try {
        const newAcronym = newAcronymEntry.save();
        res.status(201).json(newAcronym);
        res.send("Acronym definition updated");
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    res.send("update definition");
});

// DELETE /acronym/:acronym
// ▶ deletes :acronym
// ▶ uses an authorization header to ensure acronyms are protected
router.delete("/acronym/:acronym", getEntry, (req, res) => {});

module.exports = router;
