const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const SwaggerUI = require("swagger-ui-express");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ROUTER
const db = require("./src/models");
const scoreRouter = require("./src/routers/scoreRoute");
const indexRouter = require("./src/routers/indexRoute");
const userRouter = require("./src/routers/userRoute");
const examRoute = require("./src/routers/examRoute");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Muslim Maya API",
      version: "1.0.0",
      description: "muslim maya api documentation",
    },
    servers: [
      {
        url: "https://muslim-maya-production.up.railway.app/",
      },
    ],
  },
  apis: ["./src/routers/*.js"], // files containing annotations as above
};
const specs = swaggerJSDoc(options);

app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(specs));
app.use("/", indexRouter);
app.use("/scores", scoreRouter);
app.use("/users", userRouter);
app.use("/exams", examRoute);

let PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log("server run at port " + PORT));
});
