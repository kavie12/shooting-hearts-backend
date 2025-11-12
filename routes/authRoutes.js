const router = require("express").Router();
const { signup, login, verify, refresh } = require("../controllers/authController.js");

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verify);
router.post("/refresh", refresh);

module.exports = router;