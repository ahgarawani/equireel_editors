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

module.exports = mongoose.model("Event", eventSchema);
