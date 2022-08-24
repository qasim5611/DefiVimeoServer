const { Schema, model } = require("mongoose");

const DefiSchema = new Schema({
  userId: {
    type: Number,
  },
  parent: {
    type: Number,
  },
  package: {
    type: Number,
  },
  account: {
    type: String,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Defi-Schema",
    },
  ],

  startAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

const Defi = model("Defi-Schema", DefiSchema);

module.exports = Defi;
