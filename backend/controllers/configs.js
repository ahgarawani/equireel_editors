const Config = require("../models/config");

exports.getWeek = async (req, res, next) => {
  const invoicesIndices = await Config.findOne();
  res.status(200).json({
    message: "Week fetched succesfully",
    week: invoicesIndices.week,
  });
};

exports.getMonth = async (req, res, next) => {
  const invoicesIndices = await Config.findOne();
  res.status(200).json({
    message: "Month fetched succesfully",
    month: invoicesIndices.month,
  });
};

exports.endWeek = async (req, res, next) => {
  const invoicesIndices = await Config.findOne();
  invoicesIndices.week += 1;
  await invoicesIndices.save();
  res.status(200).json({
    message: "Week ended succesfully",
    newWeek: invoicesIndices.week,
  });
};

exports.endMonth = async (req, res, next) => {
  const invoicesIndices = await Config.findOne();
  const pastMonthDate = new Date(invoicesIndices.month);
  const [month, year] = [pastMonthDate.getMonth(), pastMonthDate.getFullYear()];
  const currentMonthDate = new Date(
    year + Math.floor((month + 1) / 12),
    (month + 1) % 12,
    1
  );
  invoicesIndices.month = currentMonthDate.toLocaleString("en-us", {
    month: "long",
    year: "numeric",
  });
  await invoicesIndices.save();
  res.status(200).json({
    message: "Month ended succesfully",
    newMonth: invoicesIndices.month,
  });
};
