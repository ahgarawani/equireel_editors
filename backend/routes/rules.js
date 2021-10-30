const express = require("express");

const rulesController = require("../controllers/rules");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, rulesController.getAllRules);

module.exports = router;
