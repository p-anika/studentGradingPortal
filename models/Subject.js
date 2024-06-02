const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const SubjectSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  creditHours: Number
})


module.exports = mongoose.model("Subject", SubjectSchema);