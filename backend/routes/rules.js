const express = require("express");

const rulesController = require("../controllers/rules");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, rulesController.getAllRules);
router.post("/", isAuth, rulesController.addRule);
router.patch("/removeEvent", isAuth, rulesController.removeEventFromRule);

module.exports = router;
