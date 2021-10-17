const express = require("express");

const authController = require("../controllers/auth");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/login", authController.login);
router.get("/allEditors", isAuth, authController.getAllEditors);
router.get("/role", isAuth, authController.getRole);

module.exports = router;
