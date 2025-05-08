// database.test.js

// Load necessary modules
const assert = require("assert");
const Database = require("../lib/database.js");
const userColumns = require("./_userColumns.js");

// define test database location
const database_url = "test.sqlite";

// Define test data
const userValues = {
  firstname: "Donald",
  lastname: "Duck",
  email: "donald.duck@disney.com",
  password: "abcd-1234",
  active: true,
};

// Initialize database instance
const db = new Database();

// turn sql logging on
//  db.logging = true;

test("connect/connected", () => {
  db.connect(database_url);
  assert.strictEqual(db.connected, true);
});

test("dropTable", () => {
  db.dropTable("users");
});

test("createTable", () => {
  db.createTable("users", userColumns);
});

test("insert", () => {
  const data = db.insert("users", userColumns, userValues);
  assert.strictEqual(data.id, 1);
});

test("update", () => {
  const item = db.update("users", userColumns, { id: 1, active: false });
  //  assert.strictEqual(item.active, false);
});

test("findById", () => {
  let item = db.findById("users", userColumns, 1);
  assert.strictEqual(item.active, false);
});

test("findOne", () => {
  let item = db.findOne("users", userColumns, "email = :email", {
    email: "donald.duck@disney.com",
  });
  assert.strictEqual(item.active, false);
});

test("findMany", () => {
  const list = db.findMany("users", userColumns, `ID = 1`);
  assert.strictEqual(list.length, 1);
});

test("delete", () => {
  //let ok = db.delete("users", 1);
  //assert.strictEqual(ok, true);
});

test("disconnect", () => {
  db.disconnect();
  assert.strictEqual(db.connected, false);
});
