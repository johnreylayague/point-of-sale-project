const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const authRoutes = require("./routes/auth-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Could not find this route." });
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-project.mln0xoq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
