const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ruleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
        default: [],
      },
    ],
    description: {
      itemType: {
        type: [String],
        enum: ["Project", "XC", "SJ"],
        required: true,
      },
      itemPrice: { type: Number, required: true },
      timeRange: {
        type: [Number],
        default: [0, Number.POSITIVE_INFINITY],
      },
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rule", ruleSchema);
