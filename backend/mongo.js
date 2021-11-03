require("dotenv").config();
const mongoose = require("mongoose");

const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASSWORD;
const mongoUrl  = process.env.MONGO_URL;
const mongoDB   = process.env.MONGO_DATABASE;

mongoose.connect(
  `mongodb://localhost:27017/metamask`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

mongoose.connection.on("error", function (ref) {
  console.log(ref);
});
mongoose.connection.on("open", function () {
  console.log("Connected to mongo server.");
});
