// index.js:

// load all necessary modules
const Database = require("./lib/database.js");
const Enums = require("./lib/enums.js");
const Model = require("./lib/model.js");
const {
  primaryInteger,
  primaryString,
  primaryUUID,
  blob,
  boolean,
  date,
  float,
  integer,
  string,
  time,
  timestamp,
} = require("./lib/columns.js");

const DataTypes = {
  primaryInteger,
  primaryString,
  primaryUUID,
  blob,
  boolean,
  date,
  float,
  integer,
  string,
  time,
  timestamp,
};

// define all option values
const Options = { required: true, indexed: true, unique: true };

// export all necessary types
module.exports = {
  Database,
  DataTypes,
  Enums,
  Model,
  Options,
};
