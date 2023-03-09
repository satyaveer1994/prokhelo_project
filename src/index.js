const express = require("express");

const bodyParser = require("body-parser");

const route = require("./route/routes");

const app = express();

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose
  .connect(
    "mongodb+srv://Satyaveer1994:Satyaveer123@cluster0.pn1nk.mongodb.net/satyaveer-DB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
