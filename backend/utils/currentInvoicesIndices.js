const Config = require("../models/config");

const loadIndices = async () => {
  const indices = await Config.findOne();
  console.log(indices);
  return indices;
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
  indices.save();
};

exports.setMonth = (newMonth) => {
  /**
   * Set the month index like this "October 2021".
   * @param {String}    newMonth   new index string like this "October 2021"
   */
  const indices = loadIndices();
  indices.month = newMonth;
  indices.save();
};
