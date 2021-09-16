const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./models/users");
const compare = bcrypt.compare;
const hash = bcrypt.hash;

// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function (err, result) {
    // result == false
});

// This is also compatible with async/await

async function checkUser(username, password) {
    //... fetch user from a db etc.

    const match = await bcrypt.compare(password, user.passwordHash);

    if (match) {
        //login
    }

    //...
}

exports.hash = await bcrypt.hash(password, saltRounds);
