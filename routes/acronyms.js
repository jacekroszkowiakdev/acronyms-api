const express = require("express");
const router = express.Router();

// 1.
// GET /acronym?from=50&limit=10&search=:search
// ▶ returns a list of acronyms, paginated using query parameters
// ▶ response headers indicate if there are more results
// ▶ returns all acronyms that fuzzy match against :search
router.get("/acronym?from=50&limit=10&search=:search", (req, res) => {
    res.send("get paginated");
});

// 2.
// GET /acronym/:acronym
// ▶ returns the acronym and definition matching :acronym
router.get("/acronym/:acronym", (req, res) => {
    res.send("get definition");
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
