import express, {Response, Request} from "express";
import { validateTokenWebiste } from "../utils/JWT";

const router = express.Router();

router.get("/ujian", validateTokenWebiste, (req:Request, res:Response) => {
  res.render("examsPage", {user: req.user});
});
router.get("/ujian/buat", validateTokenWebiste, (req:Request, res:Response) => {
  res.render("examsCreate", {user: req.user});
});
router.get("/ujian/edit/:id", validateTokenWebiste, (req:Request, res:Response) => {
  res.render("examsEdit", {user: req.user});
});
router.get("/nilai", validateTokenWebiste, (req:Request, res:Response) => {
  res.render("nilaiPage", {user: req.user});
});
router.get("/siswa", validateTokenWebiste, (req:Request, res:Response) => {
  res.render("siswaPage", {user: req.user});
});

router.get("/siswa/buat", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role == "super_admin") {
    res.render("siswaCreate", {
      user: req.user,
    });
  } else {
    res.redirect("/siswa");
  }
});
router.get("/siswa/edit/:id", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role == "super_admin") {
    res.render("siswaEdit", {
      user: req.user,
    });
  } else {
    res.redirect("/siswa");
  }
});
router.get("/", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role == "super_admin") return res.redirect("/admin");
  res.render("berandaPage", {
    user: req.user,
  });
});
router.get("/login", (req:Request, res:Response) => {
  if (req.cookies["login-token"]) {
    res.redirect("/");
  } else {
    res.render("loginPage");
  }
});



// ****** All Admin website page ******

router.get("/admin", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superAdminPage", {
    user: req.user,
  });
});
router.get("/admin/buat", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superAdminCreate", {
    user: req.user,
  });
});
router.get("/admin/edit/:id", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superAdminEdit", {
    user: req.user,
  });
});
router.get("/topik", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superUjianPage", {
    user: req.user,
  });
});
router.get("/topik/buat", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superUjianCreate", {
    user: req.user,
  });
});
router.get("/topik/edit/:id", validateTokenWebiste, (req:Request, res:Response) => {
  if (req.user.role !== "super_admin") return res.redirect("/");
  res.render("superUjianEdit", {
    user: req.user,
  });
});



export = router;
