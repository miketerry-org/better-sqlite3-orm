// model.test.js

// Load necessary modules
const assert = require("assert");
const Database = require("../lib/database.js");
const UserModel = require("./_userModel.js");

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

test("connect/connected", () => {
  db.connect(database_url);
  assert.strictEqual(db.connected, true);
});

test("Model.dropTable", () => {
  let user = new UserModel(db);
  user.dropTable();
  user = null;
});

test("Model.createTable", () => {
  let user = new UserModel(db);
  user.createTable();
  user = null;
});

test("Model.insert", () => {
  let user = new UserModel(db);
  user.firstname = "Donald";
  user.lastname = "Duck";
  user.email = "donald.duck@disney.com";
  user.password = "abcd-1234";
  user.active = true;
  let data = user.insert();
  assert.strictEqual(data.id, 1);
  assert.strictEqual(user.id, 1);
  user = null;
});

test("Model.findById", () => {
  let user = new UserModel(db);
  let data = user.findById(1);
  assert.strictEqual(user.id, 1);
  assert.strictEqual(data.id, 1);
  user = null;
});

test("Model.update", () => {
  let user = new UserModel(db);
  user.findById(1);
  assert.strictEqual(user.id, 1);

  user.email = "new.email@gmail.com";
  let data = user.update();
  assert.strictEqual(user.email, "new.email@gmail.com");
  assert.strictEqual(data.email, user.email);
  user = null;
});

test("Model.findByColumn", () => {
  let user = new UserModel(db);
  let data = user.findByColumn("lastname", "Duck");
  assert.strictEqual(data.firstname, "Donald");
  assert.strictEqual(user.lastname, "Duck");
  user = null;
});

test("Model.findOne", () => {
  let user = new UserModel(db);
  let data = user.findOne("lastname = :lastname", { lastname: "Duck" });
  assert.strictEqual(data.firstname, "Donald");
  assert.strictEqual(user.firstname, "Donald");
  user = null;
});

test("Model.findMany", () => {
  let user = new UserModel(db);
  let data = user.findMany();
  assert.strictEqual(data.length, 1);

  data = user.findMany("active = true");
  assert.strictEqual(data.length, 1);

  data = user.findMany("active =:active", { active: false });
  assert.strictEqual(data.length, 0);

  user = null;
});

test("UserModel.findByEmail", () => {
  let user = new UserModel(db);
  let data = user.findByEmail("new.email@gmail.com");
  assert.strictEqual(data.email, "new.email@gmail.com");
});

test("Model.delete", () => {
  let user = new UserModel(db);
  user.findById(1);
  let ok = user.delete();
  assert.strictEqual(ok, true);
});

test("disconnect", () => {
  db.disconnect();
  assert.strictEqual(db.connected, false);
});
