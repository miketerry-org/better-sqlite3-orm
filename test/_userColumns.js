// _userColumns.js: implements model for user table

// load all necessary modules
const {
  primaryInteger,
  boolean,
  string,
  timestamp,
} = require("../lib/columns.js");

// export the user columns
const userColumns = [
  primaryInteger("id"),
  string("firstname", 20, true),
  string("lastname", 20, true),
  string("email", 60, true, true, true),
  string("password", 60, true),
  boolean("active", true),
  timestamp("created_at", true),
  timestamp("updated_at", false),
];

// export the user columns
module.exports = userColumns;
