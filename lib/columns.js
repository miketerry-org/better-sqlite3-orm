// columns.js

// define all supported column types
const DATA_TYPES = {
  INTEGER: "INTEGER",
  STRING: "STRING",
  BLOB: "BLOB",
  BOOLEAN: "BOOLEAN",
  DATE: "DATE",
  FLOAT: "FLOAT",
  TIME: "TIME",
  TIMESTAMP: "TIMESTAMP",
};

/**
 * Creates a column definition object.
 * @param {string} name - The name of the column.
 * @param {string} type - The data type of the column.
 * @param {number} [size] - The size of the column (if applicable).
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @param {boolean} [indexed=false] - Indicates if the column is indexed.
 * @param {boolean} [unique=false] - Indicates if the column must have unique values.
 * @param {boolean} [primaryKey=false] - Indicates if the column is a primary key.
 * @param {boolean} [auto=false] - Indicates if the column value is auto-assigned.
 * @param {*} [defaultValue=undefined] - The default value for the column.
 * @returns {object} The column definition.
 */
function column(
  name,
  type,
  size = undefined,
  required = false,
  indexed = false,
  unique = false,
  primaryKey = false,
  auto = false,
  defaultValue = undefined
) {
  return {
    name,
    type,
    size,
    required,
    indexed,
    unique,
    primaryKey,
    auto,
    defaultValue,
  };
}

/**
 * Creates a primary integer column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [auto=true] - Indicates if the value is auto-incremented.
 * @returns {object} The primary integer column definition.
 */
function primaryInteger(name, auto = true) {
  return column(
    name, // name - column name
    DATA_TYPES.INTEGER, // type - INTEGER
    undefined, // size - not applicable
    undefined, // required - database handles this
    undefined, // indexed - database handles this
    undefined, // unique - database handles this
    true, // primaryKey - true for primary key
    auto, // auto - auto-increment setting
    undefined // defaultValue - no default value
  );
}

/**
 * Creates a primary string column definition.
 * @param {string} name - The name of the column.
 * @param {number} size - The maximum number of characters.
 * @returns {object} The primary string column definition.
 * @throws Will throw an error if size is not a positive integer.
 */
function primaryString(name, size) {
  if (size && size <= 0) {
    throw new Error("Size must be a positive integer.");
  }

  return column(
    name, // name - column name
    DATA_TYPES.STRING, // type - STRING
    size, // size - maximum number of characters
    undefined, // required - database handles this
    undefined, // indexed - database handles this
    undefined, // unique - database handles this
    true, // primaryKey - true for primary key
    false, // auto - cannot auto-assign
    undefined // defaultValue - no default value
  );
}

/**
 * Creates a primary UUID column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [auto=true] - Indicates if the value is auto-assigned.
 * @returns {object} The primary UUID column definition.
 */
function primaryUUID(name, auto = true) {
  return column(
    name, // name - column name
    DATA_TYPES.STRING, // type - STRING
    36, // size - UUID length
    true, // required - true for primary key
    undefined, // indexed - database handles this
    undefined, // unique - database handles this
    true, // primaryKey - true for primary key
    auto, // auto - auto-assign UUID
    undefined // defaultValue - no default value
  );
}

/**
 * Creates a BLOB column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @returns {object} The BLOB column definition.
 */
function blob(name, required = false) {
  return column(
    name, // name - column name
    DATA_TYPES.BLOB, // type - BLOB
    undefined, // size - not applicable
    required, // required - true if column must have a value
    false, // indexed - cannot index BLOB
    false, // unique - cannot be unique
    undefined, // primaryKey - cannot be primary key
    undefined, // auto - cannot auto-assign
    undefined // defaultValue - no default value
  );
}

/**
 * Creates a BOOLEAN column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @param {boolean} [indexed=false] - Indicates if the column is indexed.
 * @param {boolean} [unique=false] - Indicates if the column must have unique values.
 * @param {*} [defaultValue=undefined] - The default value for the column.
 * @returns {object} The BOOLEAN column definition.
 */
function boolean(
  name,
  required = false,
  indexed = false,
  unique = false,
  defaultValue = undefined
) {
  return column(
    name, // name - column name
    DATA_TYPES.BOOLEAN, // type - BOOLEAN
    undefined, // size - not applicable
    required, // required - true if column must have a value
    indexed, // indexed - when true database will index column
    unique, // unique - when true database will ensure unique values
    undefined, // primaryKey - cannot be primary key
    undefined, // auto - cannot auto-assign
    defaultValue // defaultValue - default value for column
  );
}

/**
 * Creates a DATE column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @param {boolean} [indexed=false] - Indicates if the column is indexed.
 * @param {boolean} [unique=false] - Indicates if the column must have unique values.
 * @param {boolean} [primaryKey=false] - Indicates if the column is primary key
 * @param {boolean} [auto=false] - Indicates if the column value is auto-assigned.
 * @param {*} [defaultValue=undefined] - The default value for the column.
 * @returns {object} The DATE column definition.
 */
function date(
  name,
  required = false,
  indexed = false,
  unique = false,
  primaryKey = false,
  auto = false,
  defaultValue = undefined
) {
  return column(
    name, // name - column name
    DATA_TYPES.DATE, // type - DATE
    10, // size - fixed size for date format (YYYY-MM-DD)
    required, // required - when true column must have value
    indexed, // indexed - when true database will index column
    unique, // unique - when true database will ensure column has unique values
    primaryKey, // primaryKey - when true database will make column primary
    auto, // auto - indicates if database will assign value
    defaultValue // defaultValue - default value for column
  );
}

/**
 * Creates a FLOAT column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @param {boolean} [indexed=false] - Indicates if the column is indexed.
 * @param {boolean} [unique=false] - Indicates if the column must have unique values.
 * @param {*} [defaultValue=undefined] - The default value for the column.
 * @returns {object} The FLOAT column definition.
 */
function float(
  name,
  required = false,
  indexed = false,
  unique = false,
  defaultValue = undefined
) {
  return column(
    name, // name - column name
    DATA_TYPES.FLOAT, // type - REAL (floating point)
    undefined, // size - not applicable for SQLite
    required, // required - when true database ensures a value is assigned
    indexed, // indexed - when true database will index column
    unique, // unique - when true database will ensure column is unique
    undefined, // primaryKey - cannot be primary key
    undefined, // auto - cannot auto-assign
    defaultValue // defaultValue - used when column value is not specified
  );
}

/**
 * Creates an INTEGER column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @param {boolean} [indexed=false] - Indicates if the column is indexed.
 * @param {boolean} [unique=false] - Indicates if the column must have unique values.
 * @param {*} [defaultValue=undefined] - The default value for the column.
 * @returns {object} The INTEGER column definition.
 */
function integer(
  name,
  required = false,
  indexed = false,
  unique = false,
  defaultValue = undefined
) {
  return column(
    name, // name - column name
    DATA_TYPES.INTEGER, // type - INTEGER
    undefined, // size - not applicable
    required, // required - when true, column must have a value
    indexed, // indexed - when true database will index column
    unique, // unique - when true database will ensure column is unique
    false, // primaryKey - primary key should use primaryInteger
    undefined, // auto - auto-assign should use primaryInteger
    defaultValue // defaultValue - used when column value is not specified
  );
}

/**
 * Creates a STRING column definition.
 * @param {string} name - The name of the column.
 * @param {number} [size] - The maximum number of characters.
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @param {boolean} [indexed=false] - Indicates if the column is indexed.
 * @param {boolean} [unique=false] - Indicates if the column must have unique values.
 * @param {*} [defaultValue=undefined] - The default value for the column.
 * @returns {object} The STRING column definition.
 * @throws Will throw an error if size is not a positive integer.
 */
function string(
  name,
  size = undefined,
  required = false,
  indexed = false,
  unique = false,
  defaultValue = undefined
) {
  if (size && size <= 0) {
    throw new Error("Size must be a positive integer.");
  }

  let col = column(
    name, // name - column name
    DATA_TYPES.STRING, // type - STRING
    size, // size - maximum number of characters
    required, // required - when true, database will ensure column has value
    indexed, // indexed - when true, database will ensure column is indexed
    unique, // unique - when true, database will ensure column is unique
    undefined, // primaryKey - for primary string use primaryString
    undefined, // auto - string column cannot automatically be assigned
    defaultValue // defaultValue - column value when no value is specified
  );
  return col;
}

/**
 * Creates a TIME column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @param {boolean} [indexed=false] - Indicates if the column is indexed.
 * @param {boolean} [unique=false] - Indicates if the column must have unique values.
 * @param {*} [defaultValue=undefined] - The default value for the column.
 * @returns {object} The TIME column definition.
 */
function time(
  name,
  required = false,
  indexed = false,
  unique = false,
  defaultValue = undefined
) {
  return column(
    name, // name - column name
    DATA_TYPES.TIME, // type - TIME
    12, // size - varchar(12) for time format
    required, // required - when true, column must have value
    indexed, // indexed - when true, database will index column
    unique, // unique - when true, database will ensure column is unique
    undefined, // primaryKey - cannot be primary key
    false, // auto - cannot auto-assign
    defaultValue // defaultValue - column value assigned when one is not specified
  );
}

/**
 * Creates a TIMESTAMP column definition.
 * @param {string} name - The name of the column.
 * @param {boolean} [required=false] - Indicates if the column is required.
 * @param {boolean} [indexed=false] - Indicates if the column is indexed.
 * @param {boolean} [unique=false] - Indicates if the column must have unique values.
 * @param {boolean} [auto=false] - Indicates if the column value is auto-assigned.
 * @param {*} [defaultValue=undefined] - The default value for the column.
 * @returns {object} The TIMESTAMP column definition.
 */
function timestamp(
  name,
  required = false,
  indexed = false,
  unique = false,
  auto = false,
  defaultValue = undefined
) {
  return column(
    name, // name - column name
    DATA_TYPES.TIMESTAMP, // type - TIMESTAMP
    23, // size - varchar(23) for timestamp format
    required, // required - when true, column must have value
    indexed, // indexed - when true, database will index column
    unique, // unique - when true, database will ensure column has unique values
    undefined, // primaryKey - cannot be primary key
    auto, // auto - when true, database automatically assigns current timestamp
    defaultValue // defaultValue - specifies a default value for column
  );
}

module.exports = {
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
