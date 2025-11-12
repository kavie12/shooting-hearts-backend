const { updateHighScore, getLeaderboard } = require("../controllers/playerController");

const router = require("express").Router();

router.get("/leaderboard", getLeaderboard);
router.post("/update-high-score", updateHighScore);

module.exports = router;