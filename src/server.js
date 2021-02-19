const express = require("express");
const listEndPoints = require("express-list-endpoints");
const cors = require("cors");
const mongoose = require("mongoose");

const {
  notFoundHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const userRoutes = require("./services/users/index");
const artistRoutes = require("./services/api/index");

const server = express();

server.use(cors());
server.use(express.json());

server.use("/users", userRoutes);
server.use("/artist", artistRoutes);

server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndPoints(server));

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(process.env.PORT, () => {
      console.log("Server running on port: ", process.env.PORT);
    })
  )
  .catch(console.error);
