var mongoose = require("mongoose");

const watchedSchema = new mongoose.Schema({
  metamask_id: {
    type: String,
    trim: true,
    max: 64,
  },
  percentageWatched: {
    type: String,
    trim: true,
    max: 64,
  },
  videoId: {
    type: String,
    trim: true,
    max: 64,
  },

});

module.exports = watched = mongoose.model("watched", watchedSchema);