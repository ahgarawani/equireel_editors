const express = require("express");

const configsController = require("../controllers/configs");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/week", isAuth, configsController.getWeek);

router.get("/month", isAuth, configsController.getMonth);

router.get("/endWeek", isAuth, configsController.endWeek);

router.get("/endMonth", isAuth, configsController.endMonth);

module.exports = router;
