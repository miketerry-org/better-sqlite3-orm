// enums.js: implements functions to manage enumerated values

// Global array of enumerated types
let _enums = [];

/**
 * Adds a new enumerated type.
 * @param {string} name - The name of the enumerated type.
 * @param {Array} values - The values associated with the enumerated type.
 */
function add(name, values) {
  if (find(name) === undefined) {
    _enums.push({ name, values });
  }
}

/**
 * Finds an enumerated type by name.
 * @param {string} name - The name of the enumerated type to find.
 * @returns {Object|undefined} - Returns the enumerated type object if found, otherwise undefined.
 */
function find(name) {
  return _enums.find((item) => item.name === name);
}

/**
 * Removes an enumerated type by name.
 * @param {string} name - The name of the enumerated type to remove.
 * @throws {Error} - Throws an error if the enumerated type does not exist.
 */
function remove(name) {
  const initialLength = _enums.length;
  _enums = _enums.filter((item) => item.name !== name);

  if (_enums.length === initialLength) {
    throw new Error(`"${name}" is not defined`);
  }
}

/**
 * Updates the values of an existing enumerated type.
 * @param {string} name - The name of the enumerated type to update.
 * @param {Array} values - The new values for the enumerated type.
 * @throws {Error} - Throws an error if the enumerated type does not exist.
 */
function update(name, values) {
  const item = find(name);
  if (item) {
    item.values = values;
  } else {
    throw new Error(`"${name}" is not defined`);
  }
}

// Use process environment variable to override default authentication roles value
let value = process.env.AUTH_ROLES;
if (!value || value === "") {
  value = "Guest,Subscriber,Admin";
}
add("authRole", value.split(","));

// Export all public functions
module.exports = {
  add,
  find,
  get length() {
    return _enums.length;
  },
  remove,
  update,
};
