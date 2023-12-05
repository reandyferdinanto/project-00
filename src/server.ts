import express from "express";
import fs from "fs"
import path from "path";
import multer from 'multer';
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from 'helmet';
const app = express();


const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "blob:"], // Menambahkan "blob:"
    scriptSrc: [
      "'self'",
      'code.jquery.com',
      'cdnjs.cloudflare.com',
      'cdn.datatables.net',
      "cdn.jsdelivr.net"
    ],
  },
};

var corsOptions = {
  origin: ['https://dev.festivo.co/'],
  optionsSuccessStatus: 200
}

// default membuat folder untuk penempatan file upload
if (!fs.existsSync("public/files/uploads")) {
  if (!fs.existsSync("public/files")) {
    fs.mkdirSync("public/files");
  }
  if (!fs.existsSync("public/files/uploads")) {
    fs.mkdirSync("public/files/uploads");
  }
  if (!fs.existsSync("public/files/exports")) {
    fs.mkdirSync("public/files/exports");
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
app.use(cookieParser());

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/files", express.static(path.join(__dirname, "../public", "files")));
app.use("/", express.static(path.join(__dirname, "../public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ROUTER
import { connectToDatabase } from "./models";
import webRouter from "./routers/webRouter";
import v1Router from './routers/v1Router';
import Metric from "./models/Metric";

let PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(async() => {
    const METRIC = await Metric.findOne()
    if(!METRIC) await Metric.create()
    app.use("/", webRouter);
    app.use("/api/v1", v1Router);
    app.all("*", (req, res, next) => {
      const err = new Error(`can't find ${req.originalUrl} on the server!`);
      next(err);
    });
    app.use((error, req, res, next) => {
      error.statusCode = error.statusCode || 404;
      error.status = error.status || "error";
      res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    });
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Koneksi database gagal:", error);
  });
