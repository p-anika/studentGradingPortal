// ROOT FILE (thats why it has the starting point, with app.listen)

// import express, body-parser, helmet, morgan, etc. (all of the dependencies we had installed earlier)
const express = require("express");
const bodyParser = require("body-parser"); // translates incoming info from apis into json
const helmet = require("helmet"); // increases security
const morgan = require("morgan"); // logs all the api calls, showing what the api is, the success code, etc.
const cors = require("cors"); // stands for cross orign reference, and checks whether a certain port has access
require("dotenv").config();
const connectDB = require("./db"); // ./db references to the db.js file

// import the router file (student-grading-portal.js) into the file that launches the app (this one)
const studentGradingPortal = require("./routes/api/studentGradingPortal");


// creates the backend application. it is a constructor, and we are constructing an instance of express
const app = express();
const PORT = 4002; // the port the local server is running on. it should be between 3000 to 5000. two servers can NOT run on the same port


// use the app variable defined above to use different functions of express
// code allows front end applications run on port 3000 to get access to this backend application
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
)


// tells computer to interpret any incoming data as jsons using body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use the abilities of morgan
app.use(morgan("dev"));

// use the added security of helmet
app.use(helmet());


connectDB();

// first parameter is the base url that we are setting, second parameter says that the code behind the url is in the studentGradingPortal file
app.use("/v1/studentGradingPortal", studentGradingPortal);

// starting point for launching the server
app.listen(PORT, console.log(`API is listening on port ${PORT}`));



// BASE URL: http://localhost:4002/v1/studentGradingPortal
// this URL refers to line 45, and line 45 reroutes the user to the code in the studentGradingPortal file