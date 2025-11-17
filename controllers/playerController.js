const { updateHighScoreByUID, getLeaderboardRecords, getHighScoreByUID } = require("../firebase/FirebaseDatabase");

const getHighScore = async (req, res) => {
    try {
        const uid = req.uid;
        res.status(200).json(await getHighScoreByUID(uid));
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};

const updateHighScore = async (req, res) => {
    try {
        const { newScore } = req.body;
        const uid = req.uid;

        const playerHighScore = await getHighScoreByUID(uid);
        const currentHighScore = playerHighScore.highScore;

        if (newScore > currentHighScore) {
            await updateHighScoreByUID(uid, newScore);
        }

        res.status(200).json({ highScore: Math.max(newScore, currentHighScore) });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};

const getLeaderboard = async (req, res) => {
    try {        
        const records = await getLeaderboardRecords();
        res.status(200).json({ leaderboard: records });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    updateHighScore,
    getLeaderboard,
    getHighScore
};