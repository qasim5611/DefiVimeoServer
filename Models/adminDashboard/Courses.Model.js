


var mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    max: 64,
  },
  auther: {
    type: String,
    trim: true,
    max: 64,
  },
  instructorBio: {
    type: String,
    trim: true,
    max: 64,
  },

  module: {
    //level
    type: String,
    trim: true,
    max: 64,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
    max: 64,
  },
  moduleLists: {
    type: Array,
  },
  learnLists: {
    type: Array,
  },
  is_pinned: {
    type: String,
    trim: true,
    max: 64,
  },
  is_private_to_user: {
    type: String,
    trim: true,
    max: 64,
  },
  privacy: {
    type: String,
    trim: true,
    max: 64,
  },
  resource_key: {
    type: String,
    trim: true,
    max: 64,
  },
  uri: {
    type: String,
    trim: true,
    max: 64,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  
});

module.exports = Course = mongoose.model("Course", CourseSchema);