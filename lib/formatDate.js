// formatDate.js:

function formatDate(value, locale) {
  // Check if the value is a Date object
  if (value instanceof Date && !isNaN(value)) {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(value);
  }

  // If it's an object, convert all date values
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      // If it's an array, map over each item
      return value.map((item) => formatDate(item, locale));
    } else {
      // If it's an object, iterate over its keys
      const formattedObj = {};
      for (const key in value) {
        formattedObj[key] = formatDate(value[key], locale);
      }
      return formattedObj;
    }
  }

  // Return the original value if it's not a Date, object, or array
  return value;
}

// export public functions
module.exports = formatDate;
