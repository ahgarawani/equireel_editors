const Config = require("./config");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Project", "XC", "SJ"],
      required: true,
    },
    lifeCycle: {
      createdAt: {
        type: Date,
        required: true,
      },
      addedAt: { type: Date, default: new Date() },
      doneAt: { type: Date, default: null },
    },
    inactivenessLog: {
      totalInactivenessDuration: { type: Number, default: 0 },
      mostRecentInactivenessStartDate: {
        type: Date,
        default: null,
      },
    },
    done: { type: Boolean, default: false },
    editor: { type: Schema.Types.ObjectId, default: null, ref: "User" },
    price: { type: Number, default: -1 },
    invoicesIndices: {
      week: { type: Number, default: 0 },
      month: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

itemSchema.methods.updateItemPrice = async function () {
  const invoicesIndices = await Config.findOne();
  if (this.invoicesIndices.week === invoicesIndices.week || this.price === -1) {
    const elapsedMinutes = this.calculateElapsedMinutes();

    await this.populate({
      path: "event",
      populate: {
        path: "appliedRules",
        select: "description",
        match: {
          "description.itemType": this.type,
          "description.timeRange.0": { $lte: elapsedMinutes },
          "description.timeRange.1": { $gte: elapsedMinutes },
        },
        options: { sort: { "description.itemPrice": -1 } },
      },
    });

    this.price = this.event.appliedRules[0].description.itemPrice;
  }
};

itemSchema.methods.calculateElapsedMinutes = function () {
  this.activate();
  return Math.abs(
    Math.floor((this.lifeCycle.doneAt - this.lifeCycle.addedAt) / 60000) -
      this.inactivenessLog.totalInactivenessDuration
  );
};

itemSchema.methods.deactivate = function () {
  if (!this.inactivenessLog.mostRecentInactivenessStartDate) {
    this.inactivenessLog.mostRecentInactivenessStartDate = new Date();
  }
};

itemSchema.methods.activate = function () {
  if (this.inactivenessLog.mostRecentInactivenessStartDate) {
    this.inactivenessLog.totalInactivenessDuration += Math.floor(
      (new Date() - this.inactivenessLog.mostRecentInactivenessStartDate) /
        60000
    );
    this.inactivenessLog.mostRecentInactivenessStartDate = null;
  }
};

itemSchema.methods.markAsDone = async function (editor) {
  this.activate();
  this.lifeCycle.doneAt = new Date();
  this.done = true;
  this.editor = editor;
  const invoicesIndices = await Config.findOne();
  this.invoicesIndices.week = invoicesIndices.week;
  this.invoicesIndices.month = invoicesIndices.month;
  await this.updateItemPrice();
};

module.exports = mongoose.model("Item", itemSchema);
