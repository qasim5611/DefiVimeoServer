
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new mongoose.Schema({
  courseid: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  title: {
    type: String,
    trim: true,
    max: 64,
  },

  length: {
    //level
    type: String,
    trim: true,
    max: 64,
  },
  courseName: {
    type: String,
    trim: true,
    max: 64,
  },
  moduleName: {
    type: String,
    trim: true,
    max: 64,
  },
  userID: {
    type: String,
    trim: true,
    max: 64,
  },
  folderUri: {
    type: String,
    trim: true,
    max: 64,
  },
  myVideoUri: {
    type: String,
    trim: true,
    max: 64,
  },

  // videoUri: {
  //   type: String,
  // },


  embed: {
    type: String,
    trim: true,
    max: 64,
  },
  manage_link: {
    type: String,
    trim: true,
    max: 64,
  },
  player_embed_url: {
    type: String,
    trim: true,
    max: 64,
  },
  privacy: {
    type: String,
    trim: true,
    max: 64,
  },
  learning_desc: {
    type: String,
    trim: true,
    max: 64,
  },
  learning_tags: {
    type: Array,
  },
});


module.exports = Video = mongoose.model("Video", VideoSchema);
