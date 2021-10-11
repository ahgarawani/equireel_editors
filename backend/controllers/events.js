const Event = require("../models/event");
const Rule = require("../models/rule");
const Item = require("../models/item");
const { createUTCDate } = require("../utils/helpers");

const calculateEventDays = ({ startDate, endDate }) => {
  const millisecsInDay = 1000 * 60 * 60 * 24;
  let days = [];
  const numOfDays = (endDate - startDate) / millisecsInDay + 1;
  for (let i = 0; i < numOfDays; i++) {
    newDay = startDate.valueOf() + millisecsInDay * i;
    days.push(createUTCDate(newDay));
  }
  return days;
};

const getSeasons = async (req, res, next) => {
  try {
    const seasons = await Event.find().distinct("season");
    res.status(200).json({
      message: "Seasons fetched Successfuly!",
      seasons: seasons,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getEventsBySeason = async (req, res, next) => {
  const season = req.query.season;
  try {
    const allEvents = await Event.find({ season: season }).sort({ name: 1 });
    res.status(200).json({
      message: "Events fetched Successfuly!",
      events: allEvents.map((event) => {
        return { id: event._id, name: event.name };
      }),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const addEventService = async (season, name, period) => {
  let calculateDays, startDate, endDate;

  if (period) {
    startDate = createUTCDate(period.startDate);
    endDate = createUTCDate(period.endDate);
    calculateDays = true;
  } else {
    startDate = createUTCDate(season);
    endDate = createUTCDate(season);
    calculateDays = false;
  }

  try {
    const foundEvent = await Event.findOne({ season, name });
    if (foundEvent) {
      return;
    }
    let appliedRules = await Rule.find({ isDefault: true }, "_id");

    let days = calculateDays ? calculateEventDays({ startDate, endDate }) : [];

    let event = new Event({
      season,
      name,
      period: {
        startDate: startDate,
        endDate: endDate,
        days,
      },
      appliedRules: appliedRules,
    });

    const dbPromises = appliedRules
      .map((ruleId) =>
        Rule.findByIdAndUpdate(
          ruleId,
          { $push: { events: event._id } },
          { safe: true, upsert: true, new: true }
        )
      )
      .concat(
        days.map((day) =>
          Item.create({
            event: event,
            value: day.toLocaleDateString("en-us", { weekday: "long" }),
            type: "Project",
            lifeCycle: { createdAt: new Date() },
          })
        )
      );

    await Promise.all(dbPromises);
    return event.save();
  } catch (err) {
    throw err;
  }
};

const addEvent = async (req, res, next) => {
  const season = req.body.season;
  const name = req.body.name;
  const period = req.body.period;

  try {
    const newEvent = await addEventService(season, name, period);
    if (!newEvent) {
      res.status(403).json({
        message: "Failed to create event because it already exists!",
      });
    }
    res.status(201).json({
      message: "Event created Successfuly!",
      event: newEvent,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { addEventService, getSeasons, getEventsBySeason, addEvent };
