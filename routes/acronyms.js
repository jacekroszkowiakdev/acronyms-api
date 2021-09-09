const express = require("express");
const router = express.Router();
const Acronym = require("../models/acronym");
const hydrate = require("./hydrate");

// hydrate
router.get("/hydrate", async (req, res) => {
    try {
        await hydrate();
        res.status(200).json({ message: "DB hydrated!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1.
// GET /acronym?from=50&limit=10&search=:search
// ▶ returns a list of acronyms, paginated using query parameters
// ▶ response headers indicate if there are more results
// ▶ returns all acronyms that fuzzy match against :search
router.get("/acronym?from=50&limit=10&search=:search", (req, res) => {
    res.send("get paginated");
});

// Methods and query helpers

// A schema can also have instance methods, static methods, and query helpers. The instance and static methods are similar, but with the obvious difference that an instance method is associated with a particular record and has access to the current object. Query helpers allow you to extend mongoose's chainable query builder API (for example, allowing you to add a query "byName" in addition to the find(), findOne() and findById() methods).

// 2.
// GET /acronym/:acronym
// ▶ returns the acronym and definition matching :acronym
router.get("/acronym/:acronym", async (req, res) => {
    try {
        const acronym = await Acronym.find();
        res.json(acronym);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3.
// GET /random/:count?
// ▶ returns :count random acronyms
// ▶ the acronyms returned should not be adjacent rows from the data
router.get("/random/:count?", (req, res) => {
    res.send("get random count");
});

// 4.
// POST /acronym
// ▶ receives an acronym and definition strings
// ▶ adds the acronym definition to the db
router.post("/acronym", (req, res) => {
    res.send("post definition");
});

// 5.
// PUT /acronym/:acronym
// ▶ receives an acronym and definition strings
// ▶ uses an authorization header to ensure acronyms are protected
// ▶ updates the acronym definition to the db for :acronym
router.patch("/acronym/:acronym", (req, res) => {
    res.send("update definition");
});

//  6.
// DELETE /acronym/:acronym
// ▶ deletes :acronym
// ▶ uses an authorization header to ensure acronyms are protected
router.delete("/acronym/:acronym", (req, res) => {
    res.send("delete definition");
});

module.exports = router;
