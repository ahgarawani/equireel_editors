const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema(
  {
    week: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);
