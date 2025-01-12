// _userModel.js:

"use strict";

// Load necessary modules
const Model = require("../lib/model.js");
const userColumns = require("./_userColumns.js");

class UserModel extends Model {
  /**
   * Constructs the UserModel instance.
   */
  constructor(db) {
    // Pass required arguments to the Model constructor
    super(db, "users", userColumns, {});
  }

  findByEmail(value) {
    return this.findByColumn("email", value);
  }
}

module.exports = UserModel;
