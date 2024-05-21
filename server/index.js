const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const countriesRoutes_BackOffice = require("./routes/bo/bo-countries-routes");
const menuRoutes_BackOffice = require("./routes/bo/bo-menus-routes");
const soldByOptionsRoutes_BackOffice = require("./routes/bo/bo-soldByOptions-router");
const productRoutes_BackOffice = require("./routes/bo/bo-products-routes");
const authRoutes_BackOffice = require("./routes/bo/bo-auth-routes");
const categoriesRoutes_BackOffice = require("./routes/bo/bo-categories-routes");
const colorsRoutes_BackOffice = require("./routes/bo/bo-colors-routes");
const shapesRoutes_BackOffice = require("./routes/bo/bo-shapes-routes");
const imagesRoutes_BackOffice = require("./routes/bo/bo-images-routers");

const productsRoutes_POS = require("./routes/pos/pos-products-routes");
const categoriesRoutes_POS = require("./routes/pos/pos-categories-routes");
const acitivtyLogRoutes_BackOffice = require("./routes/bo/bo-acitivtyLog-routes");
const representationsRoutes_BackOffice = require("./routes/bo/bo-representations-routes");
const salesRoutes_POS = require("./routes/pos/pos-sales-routes");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  next();
});

app.use("/api/v1/auth", authRoutes_BackOffice);
app.use("/api/v1/menus", menuRoutes_BackOffice);
app.use("/api/v1/products", productRoutes_BackOffice);
app.use("/api/v1/categories", categoriesRoutes_BackOffice);
app.use("/api/v1/countries", countriesRoutes_BackOffice);
app.use("/api/v1/activityLog", acitivtyLogRoutes_BackOffice);
app.use("/api/v1/soldbyoptions", soldByOptionsRoutes_BackOffice);
app.use("/api/v1/colors", colorsRoutes_BackOffice);
app.use("/api/v1/shapes", shapesRoutes_BackOffice);
app.use("/api/v1/representations", representationsRoutes_BackOffice);
app.use("/api/v1/images", imagesRoutes_BackOffice);

app.use("/api/v2/products", productsRoutes_POS);
app.use("/api/v2/categories", categoriesRoutes_POS);
app.use("/api/v2/sales", salesRoutes_POS);

app.use((req, res, next) => {
  res.status(404).json({ message: "Could not find this route." });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
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
