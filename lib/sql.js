// sql.js:

/**
 * Function to map custom types to SQLite types.
 * @param {string} type - The custom type string.
 * @param {number} [size] - The size for VARCHAR if applicable.
 * @returns {string} The SQLite type.
 * @throws {Error} Throws an error if the type is unsupported.
 */
function mapTypeToSQLite(type, size) {
  switch (type.toUpperCase()) {
    case "INTEGER":
      return "INTEGER";
    case "STRING":
      return size ? `VARCHAR(${size})` : "TEXT"; // Use VARCHAR with size or TEXT
    case "BLOB":
      return "BLOB";
    case "BOOLEAN":
      return "INTEGER"; // 0 or 1
    case "DATE":
      return "VARCHAR(10)"; // YYYY-MM-DD
    case "FLOAT":
      return "REAL";
    case "TIME":
      return "VARCHAR(12)"; // HH:MM:SS.xxx
    case "TIMESTAMP":
      return "VARCHAR(23)"; // YYYY-MM-DD HH:MM:SS.xxx
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Builds the WHERE clause for SQL queries based on the provided criteria.
 * @param {Object} criteria - The criteria object defining the WHERE conditions.
 * @returns {string} The constructed WHERE clause.
 */
function buildWhereClause(criteria) {
  const clauses = [];

  for (const key in criteria) {
    const upperKey = key.toUpperCase(); // Convert key to uppercase
    if (upperKey.startsWith("$")) {
      const operator = criteria[key];
      if (Array.isArray(operator)) {
        const subClauses = operator
          .map(buildWhereClause)
          .join(` ${upperKey.slice(1).toUpperCase()} `);
        clauses.push(`(${subClauses})`);
      }
    } else {
      const condition = criteria[key];
      if (typeof condition === "object" && condition !== null) {
        for (const op in condition) {
          const upperOp = op.toUpperCase(); // Convert operator to uppercase
          switch (upperOp) {
            case "=":
              clauses.push(`${upperKey} = @${upperKey}`);
              break;
            case "!=":
              clauses.push(`${upperKey} != @${upperKey}`);
              break;
            case ">":
            case "<":
            case ">=":
            case "<=":
              clauses.push(`${upperKey} ${upperOp} @${upperKey}_${upperOp}`);
              break;
            case "LIKE":
              clauses.push(`${upperKey} LIKE @${upperKey}_LIKE`);
              break;
            case "IN":
              const inValues = condition[upperOp]
                .map((val, index) => `@${upperKey}_in_${index}`)
                .join(", ");
              clauses.push(`${upperKey} IN (${inValues})`);
              break;
            case "BETWEEN":
              clauses.push(
                `${upperKey} BETWEEN @${upperKey}_BETWEEN_1 AND @${upperKey}_BETWEEN_2`
              );
              break;
            case "IS NULL":
              clauses.push(`${upperKey} IS NULL`);
              break;
            case "IS NOT NULL":
              clauses.push(`${upperKey} IS NOT NULL`);
              break;
            default:
              throw new Error(`Unsupported operator: ${op}`);
          }
        }
      } else {
        clauses.push(`${upperKey} = @${upperKey}`); // Simple equality
      }
    }
  }

  return clauses.join(" AND "); // Default to AND for conditions
}

/**
 * An object encapsulating SQL statement generation functions.
 * @namespace SQL
 */
const SQL = {
  createTable(tableName, columns) {
    let statements = []; // Array to hold SQL statements
    let createTableStatement = `CREATE TABLE IF NOT EXISTS ${tableName.toUpperCase()} (\n`;

    const columnDefinitions = columns.map((col) => {
      let columnDef = `${col.name.toUpperCase()} ${mapTypeToSQLite(
        col.type,
        col.size
      )}`;

      if (col.required) {
        columnDef += " NOT NULL";
      }
      if (col.defaultValue !== undefined) {
        if (col.defaultValue === "now") {
          columnDef += ` DEFAULT CURRENT_TIMESTAMP`;
        } else if (col.defaultValue === "today") {
          columnDef += ` DEFAULT (DATE('now'))`;
        } else if (
          col.type.toUpperCase() === "TIME" &&
          col.defaultValue === "now"
        ) {
          columnDef += ` DEFAULT (TIME('now'))`;
        } else {
          columnDef += ` DEFAULT '${col.defaultValue}'`;
        }
      }
      if (col.unique) {
        columnDef += " UNIQUE";
      }
      return columnDef;
    });

    // Handle the primary key column
    const primaryKeyColumn = columns.find((col) => col.primaryKey);
    if (primaryKeyColumn) {
      let primaryKeyDef = `${primaryKeyColumn.name.toUpperCase()} INTEGER PRIMARY KEY`;

      // Check if the primary key should be auto-incrementing
      if (primaryKeyColumn.auto) {
        primaryKeyDef += " AUTOINCREMENT";
      } else {
        primaryKeyDef += " NOT NULL";
      }

      createTableStatement += primaryKeyDef + ",\n";
      // Remove it from columnDefinitions
      columnDefinitions.splice(columns.indexOf(primaryKeyColumn), 1);
    }

    // Join the rest of the column definitions and finalize the CREATE TABLE statement
    createTableStatement += columnDefinitions.join(",\n");
    createTableStatement += `\n);`;

    statements.push(createTableStatement); // Add CREATE TABLE statement to the array

    // Handle indexes after the CREATE TABLE statement
    const indexes = columns.filter((col) => col.indexed);
    indexes.forEach((indexedColumn) => {
      const uniqueFlag = indexedColumn.unique ? " UNIQUE" : ""; // Check for unique flag
      statements.push(
        `CREATE${uniqueFlag} INDEX IF NOT EXISTS idx_${tableName}_${indexedColumn.name.toUpperCase()} ON ${tableName.toUpperCase()}(${indexedColumn.name.toUpperCase()});`
      );
    });

    return statements; // Return array of statements
  },

  /**
   * Generates an SQL statement to drop a table.
   * @param {string} table - The name of the table to drop.
   * @returns {string} The SQL statement to drop the table.
   */
  dropTable(table) {
    return `DROP TABLE IF EXISTS ${table.toUpperCase()};`;
  },

  /**
   * Generates an SQL INSERT statement with named parameters.
   * @param {string} table - The name of the table to insert into.
   * @param {Object} values - An object containing column names and their corresponding values.
   * @returns {string} The SQL INSERT statement.
   */
  insert(tableName, values) {
    // Extract column names and named parameters
    const cols = Object.keys(values);
    const namedParameters = cols
      .map((key) => `@${key.toUpperCase()}`)
      .join(", ");

    // Check if there are valid columns and values
    if (cols.length === 0) {
      throw new Error("No valid columns to insert.");
    }

    // Prepare the SQL statement
    const statement = `INSERT INTO ${tableName.toUpperCase()} (${cols
      .map((key) => key.toUpperCase())
      .join(", ")}) VALUES (${namedParameters});`;

    return statement; // Return the complete SQL statement
  },

  /**
   * Generates an SQL statement to delete a row from a table.
   * @param {string} table - The name of the table to delete from.
   * @returns {string} The SQL statement to delete the row.
   */
  delete(table) {
    return `DELETE FROM ${table.toUpperCase()} WHERE ID = @ID;`; // ID should be uppercase
  },

  /**
   * Generates an SQL UPDATE statement with named parameters.
   * @param {string} table - The name of the table to update.
   * @param {Object} values - An object containing column names and their corresponding values.
   * @returns {string} The SQL UPDATE statement.
   * @throws {Error} Throws an error if 'id' is not provided or is null.
   */
  update(table, values) {
    if (!values.ID) {
      throw new Error("The 'id' property must be provided and not be null.");
    }

    const filteredValues = Object.entries(values).filter(
      ([key]) => key.toLowerCase() !== "id"
    );

    const setClauses = filteredValues
      .map(([key]) => `${key.toUpperCase()} = :${key.toUpperCase()}`)
      .join(", ");

    const statement = `UPDATE ${table.toUpperCase()} SET ${setClauses} WHERE ID = :ID;`;

    return statement;
  },

  /**
   * Generates an SQL statement to find a row by ID.
   * @param {string} table - The name of the table to query.
   * @returns {string} The SQL statement to find the row by ID.
   */
  findById(tableName, id) {
    return `SELECT * FROM ${tableName.toUpperCase()} WHERE ID = ${id};`; // ID should be uppercase
  },

  /**
   * Generates an SQL statement to find multiple rows based on criteria.
   * @param {string} table - The name of the table to query.
   * @param {Object} where - An object representing the criteria for the query.
   * @returns {string} The SQL statement to find multiple rows based on the criteria.
   */
  findMany(table, where) {
    const whereClause = buildWhereClause(where);
    return `SELECT * FROM ${table.toUpperCase()} WHERE ${whereClause};`;
  },
};

// Export the global SQL
module.exports = SQL;
