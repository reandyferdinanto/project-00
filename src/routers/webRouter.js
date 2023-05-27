const router = require("express").Router();
const { validateRedirect } = require("../utils/JWT");

router.get("/ujian", validateRedirect, (req, res) => {
  res.render("examsPage", {
    user: req.user,
  });
});
router.get("/ujian/buat", validateRedirect, (req, res) => {
  res.render("examsCreate", {
    user: req.user,
  });
});
router.get("/nilai", validateRedirect, (req, res) => {
  res.render("nilaiPage", {
    user: req.user,
  });
});
router.get("/siswa", validateRedirect, (req, res) => {
  res.render("siswaPage", {
    user: req.user,
  });
});
router.get("/siswa/tambah", validateRedirect, (req, res) => {
  res.render("siswaCreate", {
    user: req.user,
  });
});
router.get("/", validateRedirect, (req, res) => {
  res.render("berandaPage", {
    user: req.user,
  });
});
router.get("/login", (req, res) => {
  res.render("loginPage");
});

module.exports = router;
