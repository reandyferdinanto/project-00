"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAdmin = exports.UpdateAdmin = exports.GetAdminById = exports.GetAllAdmin = exports.LogoutAdmin = exports.LoginAdmin = exports.CreateAdmin = void 0;
const Admin_1 = __importDefault(require("../../models/Admin"));
const response_1 = __importDefault(require("../response"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT_1 = require("../../utils/JWT");
async function CreateAdmin(req, res) {
    try {
        let adminData = req.body;
        if (adminData.role !== "super_admin")
            adminData.nuptk = adminData.school_id + adminData.nuptk;
        if (!adminData.password)
            adminData.password = "123";
        // hash password input before save into database
        await bcrypt_1.default.hash(adminData.password, 10).then((hash) => {
            adminData.password = hash;
            Admin_1.default.create(adminData).then((respon) => {
                (0, response_1.default)(201, "success create new user", respon, res);
            });
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to create new user", { error: error.message }, res);
    }
}
exports.CreateAdmin = CreateAdmin;
async function LoginAdmin(req, res) {
    try {
        const { nuptk, password } = req.body;
        const admin = await Admin_1.default.findOne({
            where: {
                nuptk: nuptk,
            },
        });
        if (admin == null) {
            return res.status(404).json({ error: "User not found" });
        }
        const dbPassword = admin.password;
        bcrypt_1.default.compare(password, dbPassword).then((match) => {
            if (!match) {
                res.status(400).json({ error: "wrong username and password combination" });
            }
            else {
                // Generate login-token
                const accessToken = (0, JWT_1.generateAccessToken)(admin);
                res.cookie("login-token", accessToken, {
                    httpOnly: true
                });
                // // Generate refresh-token (NOT USED)
                // const refreshToken = generateRefreshToken(admin);
                // res.cookie("refresh-token", refreshToken);
                if (admin.role == "super_admin") {
                    res.status(200).json({ route: "/admin", status: "success", accessToken });
                }
                else {
                    res.status(200).json({ route: "/", status: "success" });
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.LoginAdmin = LoginAdmin;
async function LogoutAdmin(req, res) {
    res.clearCookie("login-token");
    res.redirect("/login");
}
exports.LogoutAdmin = LogoutAdmin;
async function GetAllAdmin(req, res) {
    try {
        await Admin_1.default.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        }).then((result) => {
            (0, response_1.default)(200, "success get all admin", result, res);
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to get admin", { error: error.message }, res);
    }
}
exports.GetAllAdmin = GetAllAdmin;
async function GetAdminById(req, res) {
    const pk = req.params.id;
    try {
        const admin = await Admin_1.default.findByPk(pk, { attributes: { exclude: ["createdAt", "updatedAt", "password"], }, });
        if (!admin)
            return (0, response_1.default)(404, `no admin with id ${pk}`, [], res);
        (0, response_1.default)(200, "success get all admin", admin, res);
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to get admin", { error: error.message }, res);
    }
}
exports.GetAdminById = GetAdminById;
async function UpdateAdmin(req, res) {
    try {
        let adminData = req.body;
        const adminId = req.params.id;
        let admin = await Admin_1.default.findByPk(adminId);
        if (admin) {
            if (adminData.new_password) {
                bcrypt_1.default.hash(adminData.new_password, 10).then((hash) => {
                    adminData.password = hash;
                    admin.update(adminData);
                    return (0, response_1.default)(200, "success update admin data", [], res);
                });
            }
            else {
                adminData.nuptk = admin.school_id + adminData.nuptk;
                admin.update(adminData);
                return (0, response_1.default)(200, "success update admin data", [], res);
            }
        }
        else {
            return (0, response_1.default)(400, "admin not found", [], res);
        }
    }
    catch (error) {
        (0, response_1.default)(200, "server failed to update admin data", req.body, res);
    }
}
exports.UpdateAdmin = UpdateAdmin;
async function DeleteAdmin(req, res) {
    try {
        let unique_id = req.body.unique_id;
        if (!unique_id)
            return (0, response_1.default)(400, "body cant be undefined", [], res);
        await Admin_1.default.destroy({
            where: {
                unique_id,
            },
        }).then((respon) => {
            if (!respon)
                return (0, response_1.default)(400, "delete failed, admin not found", respon, res);
            return (0, response_1.default)(200, "success delete admin", respon, res);
        });
    }
    catch (error) {
        (0, response_1.default)(500, "server failed to delete admin", { error: error.message }, res);
    }
}
exports.DeleteAdmin = DeleteAdmin;
//# sourceMappingURL=adminController.js.map