"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const cspOptions = {
    directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
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
};
// default membuat folder untuk penempatan file upload
if (!fs_1.default.existsSync("public/files/uploads")) {
    if (!fs_1.default.existsSync("public/files")) {
        fs_1.default.mkdirSync("public/files");
    }
    if (!fs_1.default.existsSync("public/files/uploads")) {
        fs_1.default.mkdirSync("public/files/uploads");
    }
    if (!fs_1.default.existsSync("public/files/exports")) {
        fs_1.default.mkdirSync("public/files/exports");
    }
}
// multer setup disk storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/files/uploads");
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, Date.now() + Math.floor(Math.random() * 99) + 1 + "." + extension);
    },
});
app.set("trust proxy", 1);
app.use((0, multer_1.default)({ storage: storage, limits: { fileSize: 1000000 } }).any());
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({
    xFrameOptions: { action: "deny" },
}));
app.use(helmet_1.default.contentSecurityPolicy(cspOptions));
app.use(helmet_1.default.hsts({
    maxAge: 31536000,
    includeSubDomains: true, // Sertakan subdomain
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/files", express_1.default.static(path_1.default.join(__dirname, "../public", "files")));
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
// ROUTER
const models_1 = require("./models");
const webRouter_1 = __importDefault(require("./routers/webRouter"));
const v1Router_1 = __importDefault(require("./routers/v1Router"));
const Metric_1 = __importDefault(require("./models/Metric"));
let PORT = process.env.PORT || 3000;
(0, models_1.connectToDatabase)()
    .then(async () => {
    const METRIC = await Metric_1.default.findOne();
    if (!METRIC)
        await Metric_1.default.create();
    app.use("/", webRouter_1.default);
    app.use("/api/v1", v1Router_1.default);
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
//# sourceMappingURL=server.js.map