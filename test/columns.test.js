// columns.test.js:

// load all necessary modules
const assert = require("node:assert");
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
} = require("../lib/columns.js");

// test the primaryInteger column definition function
test("primaryInteger", () => {
  // define a column of type primary integer
  let col = primaryInteger("id", true);

  // verify all properties of column
  assert.strictEqual(col.name, "id");
  assert.strictEqual(col.type, "INTEGER");
  assert.strictEqual(col.size, undefined);
  assert.strictEqual(col.required, false);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, true);
  assert.strictEqual(col.auto, true);
  assert.strictEqual(col.defaultValue, undefined);
});

// test the primaryString column definition function
test("primaryString", () => {
  // define a column of type primary string
  let col = primaryString("id", 40);

  // verify all properties of column
  assert.strictEqual(col.name, "id");
  assert.strictEqual(col.type, "STRING");
  assert.strictEqual(col.size, 40);
  assert.strictEqual(col.required, false);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, true);
  assert.strictEqual(col.auto, false);
  assert.strictEqual(col.defaultValue, undefined);
});

// test the primaryUUID column definition function
test("primaryUUID", () => {
  // define a column of type primary UUID
  let col = primaryUUID("id", true);

  // verify all properties of column
  assert.strictEqual(col.name, "id");
  assert.strictEqual(col.type, "STRING");
  assert.strictEqual(col.size, 36);
  assert.strictEqual(col.required, true);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, true);
  assert.strictEqual(col.auto, true);
  assert.strictEqual(col.defaultValue, undefined);
});

// test the boolean column definition function
test("boolean", () => {
  // define a column of type boolean
  let col = boolean("boolean", true, true, false, false);

  // verify all properties of column
  assert.strictEqual(col.name, "boolean");
  assert.strictEqual(col.type, "BOOLEAN");
  assert.strictEqual(col.size, undefined);
  assert.strictEqual(col.required, true);
  assert.strictEqual(col.indexed, true);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, false);
  assert.strictEqual(col.auto, false);
  assert.strictEqual(col.defaultValue, false);
});

// test the date column definition function
test("date", () => {
  // define a column of type date
  let col = date("date", true, false, false, false, true, undefined);

  // verify all properties of column
  assert.strictEqual(col.name, "date");
  assert.strictEqual(col.type, "DATE");
  assert.strictEqual(col.size, 10);
  assert.strictEqual(col.required, true);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, false);
  assert.strictEqual(col.auto, true);
  assert.strictEqual(col.defaultValue, undefined);
});

// test the float column definition function
test("float", () => {
  // define a column of type float
  let col = float("float", true, false, false, undefined);

  // verify all properties of column
  assert.strictEqual(col.name, "float");
  assert.strictEqual(col.type, "FLOAT");
  assert.strictEqual(col.size, undefined);
  assert.strictEqual(col.required, true);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, false);
  assert.strictEqual(col.auto, false);
  assert.strictEqual(col.defaultValue, undefined);
});

// test the integer column definition function
test("integer", () => {
  // define a column of type integer
  let col = integer("integer", true, false, false, undefined);

  // verify all properties of column
  assert.strictEqual(col.name, "integer");
  assert.strictEqual(col.type, "INTEGER");
  assert.strictEqual(col.size, undefined);
  assert.strictEqual(col.required, true);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, false);
  assert.strictEqual(col.auto, false);
  assert.strictEqual(col.defaultValue, undefined);
});

// test the string column definition function
test("string", () => {
  // define a column of type string
  let col = string("string", 20, true, false, false, undefined);

  // verify all properties of column
  assert.strictEqual(col.name, "string");
  assert.strictEqual(col.type, "STRING");
  assert.strictEqual(col.size, 20);
  assert.strictEqual(col.required, true);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, false);
  assert.strictEqual(col.auto, false);
  assert.strictEqual(col.defaultValue, undefined);
});

// test the time column definition function
test("time", () => {
  // define a column of type time
  let col = time("time", true, false, false, undefined);

  // verify all properties of column
  assert.strictEqual(col.name, "time");
  assert.strictEqual(col.type, "TIME");
  assert.strictEqual(col.size, 12);
  assert.strictEqual(col.required, true);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, false);
  assert.strictEqual(col.auto, false);
  assert.strictEqual(col.defaultValue, undefined);
});

// test the timestamp column definition function
test("timestamp", () => {
  // define a column of type timestamp
  let col = timestamp("timestamp", true, false, false, undefined);

  // verify all properties of column
  assert.strictEqual(col.name, "timestamp");
  assert.strictEqual(col.type, "TIMESTAMP");
  assert.strictEqual(col.size, 23);
  assert.strictEqual(col.required, true);
  assert.strictEqual(col.indexed, false);
  assert.strictEqual(col.unique, false);
  assert.strictEqual(col.primaryKey, false);
  assert.strictEqual(col.auto, false);
  assert.strictEqual(col.defaultValue, undefined);
});
