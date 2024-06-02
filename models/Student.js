const mongoose = require("mongoose"); // mongoose is used for the purpose of designing a Schema

const Schema = mongoose.Schema; // uses the actual Schema property of mongoose



// creates new schema called StudentSchema
const StudentSchema = new Schema({
  // name is a required field
  name: {
    type: String,
    required: true
  },
  major: String,
  class_enrollment_history: [
    {
      class_id: String,
      semester: String,
      year: Number,
      completed: {
        type: Boolean,
        // learned this property from google, and will only change the default when a student drops the class
        default: true
      }
    }
  ]
})




// exports the schema
// creates a new model with the parameters of model name, 'Student', and the schema definition, 'StudentSchema'
// this line defines the model in the mongodb website
module.exports = mongoose.model("Student", StudentSchema);






/*
{
  "name": "Anika Prakash",
  "major": "Computer Science",
  "class_enrollment_history": [
    {
        "class_id": "6652a9648d70a0579cff5f3e",
        "semester": "2",
        "year": 2025
    },
    {
        "class_id": "6652a9588d70a0579cff5f3c",
        "semester": "1",
        "year": 2024
    },
    {
        "class_id": "6652a91c8d70a0579cff5f3a",
        "semester": "2",
        "year": 2024
    },
    {
        "class_id": "6652a9178d70a0579cff5f38",
        "semester": "1",
        "year": 2024
    }
  ]
}
*/