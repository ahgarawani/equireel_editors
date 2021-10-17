const Item = require("./item.js");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    season: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    period: {
      startDate: Date,
      endDate: Date,
      days: [
        {
          type: Date,
          required: true,
        },
      ],
    },
    appliedRules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rule",
        required: true,
      },
    ],
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.methods.updatePeriod = function (dayToSet) {
  const weekdays = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  let date = new Date();
  const currentDay = date.getDay();
  const distance = (weekdays[dayToSet] - currentDay - 7) % 7;
  date.setDate(date.getDate() + distance);
  if (this.period.days.length === 0) {
    this.period.startDate = date;
  }
  this.period.endDate = date;
  this.period.days.push(date);
};

eventSchema.methods.activate = async function () {
  try {
    this.active = true;
    const eventItems = await Item.find({ event: this._id });
    await Promise.all(
      eventItems.map((item) => {
        item.activate();
        return item.save();
      })
    );
  } catch (err) {
    throw err;
  }
};

eventSchema.methods.deactivate = async function () {
  try {
    this.active = false;
    const eventItems = await Item.find({ event: this._id });
    await Promise.all(
      eventItems.map((item) => {
        item.deactivate();
        return item.save();
      })
    );
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("Event", eventSchema);
