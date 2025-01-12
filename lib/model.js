// model.js:

("use strict");

/*** check to be sure database is defined and is connected */
function checkDB(db, table, method) {
  if (!db) {
    throw new Error(`Database is undefined! (${table}.${method})`);
  } else if (!db.connected) {
    throw new error(`Database is not connected! (${table}.${method})`);
  }
}

/**
 * Represents a base Model class for ORM-like functionality.
 */
class Model {
  /**
   * Constructs a new Model instance.
   * @param {Database} db - The database instance.
   * @param {string} table - The name of the table.
   * @param {object[]} Array of column definitions.
   * @param {object} [options={}] - Additional options for the model.
   */
  constructor(db, table, columns, options = {}) {
    // ensure the db param is a valid database and that it is connected
    checkDB(db, table, "constructor");

    /***
     * @type {Database}
     * @description The database instance. For internal use only.
     */
    this.db = db;

    /***
     * @type {string}
     * @description The name of the table. For internal use only.
     */
    this.table = table;

    /***
     * @type {object[]}
     * @description The column definitions. For internal use only.
     */
    this.columns = columns;

    /***
     * @type {object}
     * @description Additional options for the model. For internal use only.
     */
    this.options = options;
  }

  /**
   * Creates the table for the model in the database.
   * @param {Database} [dbInstance] - Optional database instance to use.
   */
  createTable(dbInstance = this.db) {
    checkDB(dbInstance, this.table, "createTable");
    dbInstance.createTable(this.table, this.columns);
  }

  /**
   * Drops the table for the model in the database.
   * @param {Database} [dbInstance] - Optional database instance to use.
   */
  dropTable(dbInstance = this.db) {
    checkDB(dbInstance, this.table, "dropTable");
    dbInstance.dropTable(this.table);
  }

  /**
   * Finds a record by its ID.
   * @param {number} id - The ID of the record to find.
   * @param {Database} [dbInstance] - Optional database instance to use.
   * @returns {object|null} The record if found, or null if not.
   */
  findById(id, dbInstance = this.db) {
    checkDB(dbInstance, this.table, "findByIdd");
    let data = dbInstance.findById(this.table, this.columns, id);
    this.setData(data);
    return data;
  }

  /**
   * Finds a record by a specified column name and value.
   * @param {string} name - The name of the column to look up a record to find.
   * @param {variant} value - the value to find in the specified column
   * @param {Database} [dbInstance] - Optional database instance to use.
   * @returns {object|null} The record if found, or null if not.
   */
  findByColumn(name, value, dbInstance = this.db) {
    checkDB(dbInstance, this.table, "findByColumn");
    let data = dbInstance.findByColumn(this.table, this.columns, name, value);
    if (data !== null) {
      this.setData(data);
    }
    return data;
  }

  /**
   * Finds a single record based on a condition.
   * @param {string} criteria - The condition to match (SQL WHERE clause).
   * @param {object} params - The parameters for the condition.
   * @param {Database} [dbInstance] - Optional database instance to use.
   * @returns {object|null} The record if found, or null if not.
   */
  findOne(criteria = "", params = {}, options = {}, dbInstance = this.db) {
    checkDB(dbInstance, this.table, "findOne");
    let data = dbInstance.findOne(
      this.table,
      this.columns,
      criteria,
      params,
      options
    );
    this.setData(data);
    return data;
  }

  /**
   * Finds multiple records based on a condition.
   * @param {string} criteria - The condition to match (SQL WHERE clause).
* @param {object} params - name/value pairs for named parameters defined in criteria
  @param {object} options - optional parameters like limit and offset
      * @param {Database} [dbInstance] - Optional database instance to use.
   * @returns {object[]} An array of matching records.
   */
  findMany(criteria = "", params = {}, options = {}, dbInstance = this.db) {
    checkDB(dbInstance, this.table, "findMany");
    return dbInstance.findMany(
      this.table,
      this.columns,
      criteria,
      params,
      options
    );
  }

  /**
   * creates a new instance of the model
   * @param {object} values - The values to initialize record with
   * @param {Database} [dbInstance] - Optional database instance to use.
   * @returns {object} The empty record
   */
  create(values = {}, dbInstance = this.db) {
    checkDB(dbInstance, this.table, "create");
    const newInstance = new this(
      dbInstance,
      this.table,
      this.columns,
      this.options
    );
    newInstance.setData(values);
    return newInstance;
  }

  /**
   * Deletes a record by its ID.
   * @param {number} [id] - The ID of the record to delete. Defaults to the instance's ID.
   * @param {Database} [dbInstance] - Optional database instance to use.
   * @returns {boolean} True if the record was deleted, false otherwise.
   * @throws {Error} If no ID is provided or the instance has no ID.
   */
  delete(id = this.id, dbInstance = this.db) {
    checkDB(dbInstance, this.table, "delete");
    if (!id) {
      throw new Error(`No ID provided to ${this.constructor.name}.delete()`);
    }
    return dbInstance.delete(this.table, id);
  }

  /**
   * inserts the current model instance into the database.
   * @param {Database} [dbInstance] - Optional database instance to use.
   * @returns {Object} The saved record values from the database.
   */
  insert(dbInstance = this.db) {
    // first ensure the database is connected
    checkDB(dbInstance, this.table, "insert");

    // pass parameters to database to perform insert and return fully populated newly inserted row
    let values = dbInstance.insert(this.table, this.columns, this.getData());

    // now assign the new values to this instances properties
    this.setData(values);

    // use the get data method to return all column properties
    return this.getData();
  }

  /**
   * updates the current model instance in the database.
   * @param {Database} [dbInstance] - Optional database instance to use.
   * @returns {Object} The updated record values in the database.
   */
  update(dbInstance = this.db) {
    // first ensure the database is connected
    checkDB(dbInstance, this.table, "update");

    // pass parameters to database to perform update and return fully populated newly updated row
    let values = dbInstance.update(this.table, this.columns, this.getData());

    // now assign the new values to this instances properties
    this.setData(values);

    // use the get data method to return all column properties
    return this.getData();
  }

  /***
   * Prepares instance data for saving to the database.
   * @returns {object} The data for the current instance.
   */
  getData() {
    const data = {};

    // get an array of uppercase column names
    let colNames = [];
    this.columns.forEach((col) => colNames.push(col.name.toUpperCase()));

    // loop thru all properties on "this"
    Object.keys(this).forEach((key) => {
      // see if the key name exists in the array of column names
      let match = colNames.some((name) => name === key.toUpperCase());

      // if property is in columns then assign it to the return data
      if (match) {
        data[key] = this[key];
      }
    });

    // return the populated data
    return data;
  }

  //  Assign data values to this instance
  setData(data) {
    // ensure the data parameter is valid
    if (!data) {
      throw new Error(
        `${this.constructor.name}.setData must be passed a valid object`
      );
    }

    // loop thru all properties in data assigning them to this instance
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }
}

module.exports = Model;
