const Rule = require("../models/rule");

exports.getAllRules = async (req, res, next) => {
  try {
    const rules = await Rule.find().populate({
      path: "events",
      select: "_id name",
    });
    res.status(200).json({
      message: "Seasons fetched Successfuly!",
      rules: rules.map((rule) => ({
        id: rule._id,
        title: rule.title,
        events: rule.events.map((event) => ({
          id: event._id,
          name: event.name,
        })),
        itemType: rule.description.itemType,
        itemPrice: rule.description.itemPrice,
        timeRange: rule.description.timeRange,
      })),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
