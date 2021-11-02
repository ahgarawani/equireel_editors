const Rule = require("../models/rule");
const Event = require("../models/event");

exports.getAllRules = async (req, res, next) => {
  try {
    const rules = await Rule.find().populate({
      path: "events",
      select: "_id season name",
    });
    res.status(200).json({
      message: "Seasons fetched Successfuly!",
      rules: rules.map((rule) => ({
        id: rule._id,
        title: rule.title,
        events: rule.events.map((event) => ({
          id: event._id,
          season: event.season,
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

exports.addRule = async (req, res, next) => {
  const rule = req.body;
  try {
    const newRule = await Rule.create(rule);
    await Promise.all(
      newRule.events.map((event) =>
        Event.findByIdAndUpdate(
          event,
          { $push: { appliedRules: newRule._id } },
          { safe: true, upsert: true, new: true }
        )
      )
    );
    res.status(201).json({
      message: "Rule created Successfuly!",
      rule: { id: newRule._id, ...newRule },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.removeEventFromRule = async (req, res, next) => {
  const ruleId = req.body.rule;
  const eventId = req.body.event;
  try {
    await Promise.all([
      Rule.findByIdAndUpdate(
        ruleId,
        { $pull: { events: eventId } },
        { safe: true, upsert: true }
      ),
      Event.findByIdAndUpdate(
        eventId,
        { $pull: { appliedRules: ruleId } },
        { safe: true, upsert: true }
      ),
    ]);
    res.status(201).json({
      message: "Event removed from rule successfuly!",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
