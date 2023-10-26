const router = require("express").Router();
const { validateToken } = require("../utils/JWT");

router.get("/ujian", validateToken, (req, res) => {
  res.render("examsPage", {
    user: req.user,
  });
});
router.get("/ujian/buat", validateToken, (req, res) => {
  res.render("examsCreate", {
    user: req.user,
  });
});
router.get("/ujian/edit/:id", validateToken, (req, res) => {
  res.render("examsEdit", {
    user: req.user,
  });
});
router.get("/nilai", validateToken, (req, res) => {
  res.render("nilaiPage", {
    user: req.user,
  });
});
router.get("/siswa", validateToken, (req, res) => {
  res.render("siswaPage", {
    user: req.user,
  });
});
router.get("/siswa/tambah", validateToken, (req, res) => {
  if (req.user.role == "super_admin") {
    res.render("siswaCreate", {
      user: req.user,
    });
  } else {
    res.redirect("/siswa");
  }
});
router.get("/siswa/edit/:id", validateToken, (req, res) => {
  if (req.user.role == "super_admin") {
    res.render("siswaEdit", {
      user: req.user,
    });
  } else {
    res.redirect("/siswa");
  }
});
router.get("/", validateToken, (req, res) => {
  if (req.user.role == "super_admin") return res.redirect("/admin");
  res.render("berandaPage", {
    user: req.user,
  });
});
router.get("/login", (req, res) => {
  if (req.cookies["access-token"]) {
    res.redirect("/");
  } else {
    res.render("loginPage");
  }
});



router.get("/admin", validateToken, (req, res) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superAdminPage", {
    user: req.user,
  });
});
router.get("/admin/buat", validateToken, (req, res) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superAdminCreate", {
    user: req.user,
  });
});
router.get("/admin/edit/:id", validateToken, (req, res) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superAdminEdit", {
    user: req.user,
  });
});
router.get("/admin/tipe_ujian", validateToken, (req, res) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superUjianPage", {
    user: req.user,
  });
});
router.get("/admin/tipe_ujian/buat", validateToken, (req, res) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superUjianCreate", {
    user: req.user,
  });
});
router.get("/admin/tipe_ujian/edit/:id", validateToken, (req, res) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superUjianEdit", {
    user: req.user,
  });
});



module.exports = router;
