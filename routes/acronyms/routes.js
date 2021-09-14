const express = require("express");
const router = express.Router();
const Acronym = require("../../models/acronym");
const Users = require("../../models/users");
const hydrate = require("../hydrate");
const {
    createAcronym,
    getRandom,
    listAcronyms,
    paginateAcronyms,
    updateDefinition,
    deleteAcronym,
} = require("./selectors");
const getEntry = require("./middleware");

// hydrate DB
router.get("/hydrate", async (req, res) => {
    try {
        await hydrate();
        res.status(200).json({ message: "DB hydrated!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// // req.isAuthenticated is provided from the auth router
router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated());
    // res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
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

// GET /all
router.get("/all", async (req, res) => {
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

function escapeRegex(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// GET /acronym?from=50&limit=10&search=:search
// ▶ returns a list of acronyms, paginated using query parameters
// ▶ response headers indicate if there are more results
// ▶ returns all acronyms that fuzzy match against :search
// router.get("/acronym?", async (req, res) => {
router.get("/list/acronym", async (req, res) => {
    try {
        let fuzzyString = new RegExp(escapeRegex(req.query.search), "gi");
        // let limit = parseInt(req.query.limit);
        // let startIndex = parseInt(req.query.from);
        // let endIndex = startIndex + limit;
        // let searchQuery = req.query.search;
        // console.log("limit", limit);
        // console.log("startIndex", startIndex);
        // console.log("search query: ", searchQuery);

        const acronyms = await Acronym.find({ acronym: fuzzyString })
            .skip(parseInt(req.query.fo))
            .limit(parseInt(req.query.limit));

        // const searchResults = {};
        // acronyms.results = acronyms.slice(
        //     req.query.from,
        //     req.query.from + req.query.limit
        // );
        console.log("results: ", acronyms.results);
        res.json(acronyms.results);
        res.status(200).json({ message: "Search results paginated" });
        res.send("hello!");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /random/:count?
router.get("/random/:count?", async (req, res) => {
    try {
        // const randomAcronyms = await Acronym.aggregate([
        //     { $sample: { size: parseInt(req.query.sample) } },
        // ]);
        const randomAcronyms = await getRandom(parseInt(req.query.sample));
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
