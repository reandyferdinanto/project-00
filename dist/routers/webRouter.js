"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../utils/JWT");
const router = express_1.default.Router();
router.get("/ujian", JWT_1.validateTokenWebiste, (req, res) => {
    res.render("examsPage", { user: req.user });
});
router.get("/ujian/buat", JWT_1.validateTokenWebiste, (req, res) => {
    res.render("examsCreate", { user: req.user });
});
router.get("/ujian/edit/:id", JWT_1.validateTokenWebiste, (req, res) => {
    res.render("examsEdit", { user: req.user });
});
router.get("/nilai", JWT_1.validateTokenWebiste, (req, res) => {
    res.render("nilaiPage", { user: req.user });
});
router.get("/siswa", JWT_1.validateTokenWebiste, (req, res) => {
    res.render("siswaPage", { user: req.user });
});
router.get("/siswa/buat", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role == "super_admin") {
        res.render("siswaCreate", {
            user: req.user,
        });
    }
    else {
        res.redirect("/siswa");
    }
});
router.get("/siswa/edit/:id", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role == "super_admin") {
        res.render("siswaEdit", {
            user: req.user,
        });
    }
    else {
        res.redirect("/siswa");
    }
});
router.get("/", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role == "super_admin")
        return res.redirect("/admin");
    res.render("berandaPage", {
        user: req.user,
    });
});
router.get("/login", (req, res) => {
    if (req.cookies["login-token"]) {
        res.redirect("/");
    }
    else {
        res.render("loginPage");
    }
});
// ****** All Admin website page ******
router.get("/admin", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role !== "super_admin")
        return res.redirect("/");
    res.render("superAdminPage", {
        user: req.user,
    });
});
router.get("/admin/buat", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role !== "super_admin")
        return res.redirect("/");
    res.render("superAdminCreate", {
        user: req.user,
    });
});
router.get("/admin/edit/:id", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role !== "super_admin")
        return res.redirect("/");
    res.render("superAdminEdit", {
        user: req.user,
    });
});
router.get("/topik", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role !== "super_admin")
        return res.redirect("/");
    res.render("superUjianPage", {
        user: req.user,
    });
});
router.get("/topik/buat", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role !== "super_admin")
        return res.redirect("/");
    res.render("superUjianCreate", {
        user: req.user,
    });
});
router.get("/topik/edit/:id", JWT_1.validateTokenWebiste, (req, res) => {
    if (req.user.role !== "super_admin")
        return res.redirect("/");
    res.render("superUjianEdit", {
        user: req.user,
    });
});
module.exports = router;
//# sourceMappingURL=webRouter.js.map