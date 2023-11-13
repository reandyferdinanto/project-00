const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const helmet = require('helmet')
const cookieParse = require("cookie-parser");
const fs = require("fs");

const app = express();

// white listing untuk konten external (CSP)
const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "blob:"], // Menambahkan "blob:"
    scriptSrc: [
      "'self'",
      'code.jquery.com',
      'cdnjs.cloudflare.com',
      'cdn.datatables.net',
    ],
  },
};

// whitelisting untuk private API
// var whitelist = ["https://dev.festivo.co/", "localhost:3000/"]
var corsOptions = {
  origin: ['https://dev.festivo.co/'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// default membuat folder untuk penempatan file upload
if (!fs.existsSync("public/files/uploads")) {
  if (!fs.existsSync("public/files")) {
    fs.mkdirSync("public/files");
  }
  if (!fs.existsSync("public/files/uploads")) {
    fs.mkdirSync("public/files/uploads");
  }
}

// multer setup disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files/uploads");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, Date.now() + Math.floor(Math.random() * 99) + 1 + "." + extension);
  },
});


app.set("trust proxy",1);
app.use(multer({ storage: storage, limits: { fileSize: 1000000 } }).any());
app.use(cors(corsOptions));
app.use(cookieParse());
app.use(helmet({
  xFrameOptions: { action: "deny" },
}));
app.use(helmet.contentSecurityPolicy(cspOptions));
app.use(
  helmet.hsts({
    maxAge: 31536000, // Durasi HSTS dalam detik (setahun)
    includeSubDomains: true, // Sertakan subdomain
  })
);
// app.use(morgan("common"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/files", express.static(path.join(__dirname, "public", "files")));
app.use("/", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ROUTER
const db = require("./src/models");
const webRouter = require("./src/routers/webRouter");
const v0Router = require('./src/routers/v0Router')
const v1Router = require('./src/routers/v1Router')

app.use("/", webRouter);
app.use("/api/", v0Router);
app.use("/api/v1", v1Router);

// ERROR HANDLER
app.all("*", (req, res, next) => {
  const err = new Error(`can't find ${req.originalUrl} on the server!`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
});

let PORT = process.env.PORT || 3000;
db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log("server run at port " + PORT));
});
