const express = require("express");

const eventsController = require("../controllers/events");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/seasons", isAuth, eventsController.getSeasons);
router.get("/eventsBySeason", isAuth, eventsController.getEventsBySeason);
router.post("/", eventsController.addEvent);

module.exports = router;
