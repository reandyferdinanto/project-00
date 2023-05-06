const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ROUTER
const indexRouter = require("./src/routers/indexRouter");

app.use("/", indexRouter);

app.listen(3000, () => console.log("server run at port 3000"));
