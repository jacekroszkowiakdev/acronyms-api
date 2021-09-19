const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hash = await bcrypt.hash(password, saltRounds);
exports.compare = await bcrypt.compare(password, passwordHash);
