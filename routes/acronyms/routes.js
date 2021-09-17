const express = require("express");
const router = express.Router();
const Acronym = require("../../models/acronym");
const hydrate = require("../hydrate");
const {
    createAcronym,
    getRandom,
    listAcronyms,
    paginateAcronyms,
    updateDefinition,
    deleteAcronym,
    createUser,
    getUser,
} = require("./selectors");
const getEntry = require("./middleware");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../../models/users");
const compare = bcrypt.compare;
const hash = bcrypt.hash;
const jwt = require("jsonwebtoken");

// check Headers

const checkToken = (req, res, next) => {
    const header = req.headers["authorization"];

    if (typeof header !== "undefined") {
        const bearer = header.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
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
router.post("/acronyms/", async (req, res) => {
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

// POST /register
router.post("/acronyms/register/", async (req, res) => {
    try {
        const { username, password, role } = req.body;
        hashedPassword = await hash(password, saltRounds);
        const newUser = await createUser(username, hashedPassword, role);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST /login
router.post("/acronyms/login/", async (req, res) => {
    try {
        // const { username, password } = req.body;
        let username = req.body.username;
        let password = req.body.password;
        const userData = await getUser(username);
        compare(userData.password, password);
        console.log("passwords match: ", !!compare);
        if (compare) {
            jwt.sign(
                { user },
                "privatekey",
                { expiresIn: "1h" },
                (err, token) => {
                    if (err) {
                        console.log(err);
                    }
                    res.send(token);
                }
            );
        } else {
            console.log("Error - could not perform login");
        }
        res.status(201).json({ message: userData.password });
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
router.get("/acronyms/:acronym", getEntry, async (req, res) => {
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
router.get("/acronyms/list/acronym", async (req, res) => {
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
        res.status(200).json(acronyms.results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /random/:count?
router.get("/acronyms/random/:count?", async (req, res) => {
    try {
        let sampleSize = parseInt(req.params.count);
        const randomAcronyms = await getRandom(sampleSize);
        res.status(200).json(randomAcronyms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /:acronym
// ▶ receives an acronym and definition strings
// ▶ uses an authorization header to ensure acronyms are protected
// ▶ updates the acronym definition to the db for :acronym
router.put("/acronyms/:acronym", getEntry, async (req, res) => {
    try {
        let entry;
        let acronym = req.params;
        let definition = req.body;
        entry = await updateDefinition(acronym, definition);
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
router.delete("/acronyms/:acronym", checkToken, async (req, res) => {
    jwt.verify(req.token, "privatekey", (err, authorizedData) => {
        if (err) {
            console.log("User unauthorized");
            res.sendStatus(403);
        } else {
            res.json({
                message: "Successful log in",
                authorizedData,
            });
            console.log("Authorized user connected to protected route");
        }
    });

    try {
        let entry;
        let acronym = req.params.acronym;
        entry = await deleteAcronym(acronym);
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
