const bcrypt = require("bcrypt");
const saltRounds = 10;
// const compare = bcrypt.compare;
// const hash = bcrypt.hash;

exports.hash = await bcrypt.hash(password, saltRounds);
exports.compare = await bcrypt.compare(password, passwordHash);
