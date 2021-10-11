const fs = require("fs");
const path = require("path");

const pathToIndices = path.join(
  path.dirname(require.main.filename),
  "utils",
  "currentInvoicesIndices.json"
);

const loadIndices = () => {
  return JSON.parse(fs.readFileSync(pathToIndices, { encoding: "utf8" }));
};

const save = (indices) => {
  fs.writeFileSync(pathToIndices, JSON.stringify(indices), {
    encoding: "utf8",
  });
};

exports.getWeek = () => {
  /**
   * Get the week index (1 indexed).
   * @return {Number}             week index (1 indexed)
   */
  const indices = loadIndices();
  return indices.week;
};

exports.getMonth = () => {
  /**
   * Get the month index like this "October 2021".
   * @return {String}             week index (1 indexed)
   */
  const indices = loadIndices();
  return indices.month;
};

exports.setWeek = (newWeek) => {
  /**
   * Set the week index (1 indexed).
   * @param {Number}    newWeek   new index
   */
  const indices = loadIndices();
  indices.week = newWeek;
  save(indices);
};

exports.setMonth = (newMonth) => {
  /**
   * Set the month index like this "October 2021".
   * @param {String}    newMonth   new index string like this "October 2021"
   */
  const indices = loadIndices();
  indices.month = newMonth;
  save(indices);
};
