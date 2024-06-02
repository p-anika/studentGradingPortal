const mongoose = require("mongoose");
// get URI string from mongodb website under database > connect > step#3. copy paste it into here, and replace the <password> with the password you had set earlier for the database
const URI = "mongodb+srv://prakashanika5:hotdog123@cluster0.yrrfiev.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  console.log("database successfully connected");
}

module.exports = connectDB;