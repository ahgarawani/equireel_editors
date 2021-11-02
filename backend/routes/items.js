const express = require("express");

const itemsController = require("../controllers/items");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/sync", isAuth, itemsController.sync);

router.get("/search", isAuth, itemsController.search);

router.get("/itemsByMonth", isAuth, itemsController.getItemsByMonth);

router.get("/itemsByWeek", isAuth, itemsController.getItemsByWeek);

router.get("/week", isAuth, itemsController.getWeek);

router.get("/month", isAuth, itemsController.getMonth);

router.get("/endWeek", isAuth, itemsController.endWeek);

router.get("/endMonth", isAuth, itemsController.endMonth);

router.patch("/markItemsDone", isAuth, itemsController.markItemsDone);

module.exports = router;
