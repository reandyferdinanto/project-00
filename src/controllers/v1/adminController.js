const { Admin } = require("../../models");
const response = require("./response");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../../utils/JWT");

async function register(req, res) {
  try {
    let adminData = req.body;
    if(adminData.role !== "super_admin") adminData.nuptk = adminData.school_id+adminData.nuptk
    if(!adminData.password) adminData.password = "123"

    // hash password input before save into database
    await bcrypt.hash(adminData.password, 10).then((hash) => {
      adminData.password = hash
      Admin.create(adminData).then((respon) => {
        response(201, "success create new user", respon, res);
      });
    });
  } catch (error) {
    response(
      500,
      "server failed to create new user",
      { error: error.message },
      res
    );
  }
}

async function login(req, res) {
  try {
    const { nuptk, password } = req.body;
    const admin = await Admin.findOne({
      where: {
        nuptk: nuptk,
      },
    });
    if (admin == null) {
      return res.status(404).json({ error: "User not found" });
    }
    const dbPassword = admin.password;
    bcrypt.compare(password, dbPassword).then((match) => {
      if (!match) {
        res.status(400).json({ error: "wrong username and password combination" });
      } else {
        // Generate login-token
        const accessToken = generateAccessToken(admin);
        res.cookie("login-token", accessToken, {
          httpOnly: true
        });
        // // Generate refresh-token (NOT USED)
        // const refreshToken = generateRefreshToken(admin);
        // res.cookie("refresh-token", refreshToken);


        if (admin.role == "super_admin") {
          res.status(200).json({ route: "/admin", status: "success", accessToken });
        } else {
          res.status(200).json({ route: "/", status: "success" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function logout(req, res, next) {
  res.clearCookie("login-token");
  res.redirect("/login");
}

async function getAllAdmin(req, res) {
  try {
    await Admin.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    }).then((result) => {
      response(200, "success get all admin", result, res);
    });
  } catch (error) {
    response(500, "server failed to get admin", { error: error.message }, res);
  }
}

async function getAdminById(req, res) {
  const pk = req.params.id;
  try {
    await Admin.findByPk(pk, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    }).then((result) => {
      if (!result) return response(200, `no admin with id ${pk}`, [], res);
      response(200, "success get all admin", result, res);
    });
  } catch (error) {
    response(500, "server failed to get admin", { error: error.message }, res);
  }
}

async function updateAdmin(req, res) {
  try {
    let adminData = req.body;
    const adminId = req.params.id
    let admin = await Admin.findByPk(adminId)

    if(admin){
      if(adminData.prev_password && adminData.new_password){
        bcrypt.compare(adminData.prev_password, admin.password).then((match) => {
          if (!match) {
            res.status(400).json({ error: "Kata sandi lama yang dimasukan salah" });
          } else {
            bcrypt.hash(adminData.new_password, 10).then((hash) => {
              adminData.password = hash
              admin.update(adminData)
              response(200, "success update admin data", [], res);
            });
          }
        });
      }else{
        adminData.nuptk = admin.school_id + adminData.nuptk
        admin.update(adminData)
        response(200, "success update admin data", [], res);
      }
    }else{
      response(400, "admin not found", [], res)
    }
  } catch (error) {
    response(200, "server failed to update admin data", req.body, res);
  }
}

async function deleteAdmin(req, res) {
  try {
    let unique_id = req.body.unique_id;
    if (!unique_id) return response(400, "body cant be undefined", [], res);
    await Admin.destroy({
      where: {
        unique_id,
      },
    }).then((respon) => {
      if (!respon)
        return response(400, "delete failed, admin not found", respon, res);
      return response(200, "success delete admin", respon, res);
    });
  } catch (error) {
    response(
      500,
      "server failed to delete admin",
      { error: error.message },
      res
    );
  }
}

module.exports = {
  register,
  login,
  logout,
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
