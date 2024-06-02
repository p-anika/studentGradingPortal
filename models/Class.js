const mongoose = require("mongoose");

const Schema = mongoose.Schema;



const ClassSchema = new Schema ({
  subject_id: {
    type: String,
    required: true
  },
  teacher_id: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  student_ids: [String]
})



module.exports = mongoose.model("Class", ClassSchema);