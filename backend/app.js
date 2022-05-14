const express = require("express");

const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");

const authRoutes = require("./routes/auth");
const eventsRoutes = require("./routes/events");
const itemsRoutes = require("./routes/items");
const rulesRoutes = require("./routes/rules");
const configsRoutes = require("./routes/configs");

const app = express();

app.use(helmet());
app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/items", itemsRoutes);
app.use("/rules", rulesRoutes);
app.use("/configs", configsRoutes);

app.use((error, req, res, next) => {
  console.log(error);

  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    message: message,
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.flaxh.mongodb.net/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`
  )
  .then((client) => {
    console.log("Connected to the DB!");
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
