const express = require("express");
const router = express.Router();
const hydrate = require("./hydrate");
const {
    createAcronym,
    getRandom,
    listAcronyms,
    getPaginatedResults,
    updateDefinition,
    deleteAcronym,
    createUser,
    getUser,
} = require("./selectors");
const getEntry = require("./middleware");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const compare = bcrypt.compare;
const hash = bcrypt.hash;
const jwt = require("jsonwebtoken");
const tokenAuth = require("../../auth");

// hydrate DB
router.get("/acronyms/hydrate", async (req, res) => {
    try {
        await hydrate();
        res.status(200).json({ message: "DB hydrated!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /acronym
router.post("/acronyms/", async (req, res) => {
    try {
        const acronym = req.body.acronym;
        const definition = req.body.fullForm;
        const newAcronymEntry = await createAcronym(acronym, definition);
        res.status(201).json(newAcronymEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST /register
router.post("/acronyms/register/", async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await hash(password, saltRounds);
        const newUser = await createUser(username, hashedPassword, role);
        res.status(201).json({
            message: `${newUser.username} added to users DB`,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST /login
router.post("/acronyms/login/", async (req, res) => {
    try {
        const { username, password } = req.body;
        const userData = await getUser(username);
        const match = await compare(password, userData.password);
        if (!match) {
            return res.status(403).json({ message: "User unauthorized" });
        }
        const token = jwt.sign(
            { user: userData.username, role: userData.role },
            process.env.SECRET
        );
        res.status(201).json({
            token,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET /all
router.get("/acronyms/all", async (req, res) => {
    try {
        const acronyms = await listAcronyms();
        res.status(200).json(acronyms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /:acronym
router.get("/acronyms/:acronym", async (req, res) => {
    try {
        const query = req.params.acronym;
        const acronyms = await listAcronyms(query);
        if (acronyms && acronyms.length === 0) {
            return res.status(404).json({ message: "Entry does not exists" });
        }
        res.status(200).json(acronyms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /acronym?from=50&limit=10&search=:search
router.get("/acronyms/list/acronym", async (req, res) => {
    function escapeRegex(string) {
        return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    try {
        const fuzzyQuery = new RegExp(escapeRegex(req.query.search), "gi");
        const startIndex = parseInt(req.query.from);
        const limit = parseInt(req.query.limit);
        const allResults = await listAcronyms(fuzzyQuery);
        const paginatedResults = await getPaginatedResults(
            fuzzyQuery,
            startIndex,
            limit
        );
        const pagesCount = Math.ceil(allResults.length / limit);
        res.set("result-pages", pagesCount);
        res.status(200).json({
            "total pages": pagesCount,
            results: paginatedResults,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /random/:count?
router.get("/acronyms/random/:count?", async (req, res) => {
    try {
        const sampleSize = parseInt(req.params.count);
        const randomAcronyms = await getRandom(sampleSize);
        res.status(200).json(randomAcronyms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /:acronym
router.put("/acronyms/:acronym", tokenAuth, getEntry, async (req, res) => {
    try {
        const acronym = req.params;
        const definition = req.body;
        const entry = await updateDefinition(acronym, definition);
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
router.delete("/acronyms/:acronym", tokenAuth, async (req, res) => {
    try {
        const acronym = req.params.acronym;
        const entry = await deleteAcronym(acronym);
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
