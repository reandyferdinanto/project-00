const fs = require("fs");
const path = require("path");
const { Admin } = require("../models");
const response = require("./response");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/JWT");

function register(req, res) {
  try {
    const { username, password, role, email, nuptk } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
      Admin.create({
        username,
        password: hash,
        role,
        email,
        nuptk,
      }).then((respon) => {
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
    const { username, password } = req.body;
    const admin = await Admin.findOne({
      where: {
        username: username,
      },
    });
    if (admin == null) {
      return res.json({ error: "user not found" });
    }
    const dbPassword = admin.password;
    bcrypt.compare(password, dbPassword).then((match) => {
      if (!match) {
        res.json({ error: "wrong username and password combination" });
      } else {
        const accessToken = createToken(admin);
        res.cookie("access-token", accessToken, {
          maxAge: 3600000,
        });
        if (admin.role == "super_admin") {
          res.status(200).json({ route: "/admin" });
        } else {
          res.status(200).json({ route: "/" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function logout(req, res, next) {
  res.clearCookie("access-token");
  res.redirect("/login");
}

async function getAdmin(req, res) {
  try {
    await Admin.findAll().then((result) => {
      response(200, "success get all admin", result, res);
    });
  } catch (error) {
    response(500, "server failed to get admin", { error: error.message }, res);
  }
}
async function getAdminById(req, res) {
  const pk = req.params.id;
  try {
    await Admin.findByPk(pk).then((result) => {
      if (!result) return response(200, `no admin with id ${pk}`, [], res);
      response(200, "success get all admin", result, res);
    });
  } catch (error) {
    response(500, "server failed to get admin", { error: error.message }, res);
  }
}
async function updateAdmin(req, res) {
  try {
    const { unique_id, email, nuptk, username } = req.body;
    await Admin.findOne({
      where: {
        unique_id: unique_id,
      },
    }).then((prev) => {
      if (!prev) return response(400, "user not found", [], res);
      Admin.update(
        {
          username: username !== undefined ? username : prev.username,
          email: email !== undefined ? email : prev.email,
          nuptk: nuptk !== undefined ? nuptk : prev.nuptk,
        },
        {
          where: {
            unique_id,
          },
        }
      );
    });
    response(200, "success update admin data", [], res);
  } catch (error) {
    response(200, "server failed to update admin data", req.body, res);
  }
}

async function resetPassword(req, res) {
  try {
    const { unique_id, password_lama, password_baru } = req.body;
    await Admin.findByPk(unique_id).then((result) => {
      if (!result) return res.json({ error: "user not found" });
      const dbPassword = result.password;
      bcrypt.compare(password_lama, dbPassword).then((match) => {
        if (!match) {
          return response(400, "password lama salah", [], res);
        } else {
          bcrypt.hash(password_baru, 10).then((hash) => {
            Admin.update(
              {
                password: hash,
              },
              {
                where: {
                  unique_id,
                },
              }
            ).then(() => {
              response(200, "success change admin password", [], res);
            });
          });
        }
      });
    });
  } catch (error) {
    response(500, "server failed to chang admin data", [], res);
  }
}

async function deleteAdmin(req, res) {
  try {
    let checkedAdmin = req.body.checkedAdmin;
    if (!checkedAdmin) return response(400, "body cant be undefined", [], res);
    await Admin.destroy({
      where: {
        unique_id: checkedAdmin,
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
  getAdmin,
  getAdminById,
  updateAdmin,
  resetPassword,
  deleteAdmin,
};
