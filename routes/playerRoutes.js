const { updateHighScore, getLeaderboard, getHighScore } = require("../controllers/playerController");

const router = require("express").Router();

router.get("/leaderboard", getLeaderboard);
router.post("/update-high-score", updateHighScore);
router.get("/get-high-score", getHighScore);

module.exports = router;