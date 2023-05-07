const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ROUTER
const db = require("./src/models");
const indexRouter = require("./src/routers/scoreRoute");

app.use("/scores", indexRouter);

db.sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () => console.log("server run at port 3000"));
});
