const express = require("express");
const { initFirebase } = require("./utils/FirebaseAdmin.js");
const SERVER_PORT = 3000;

initFirebase();

const app = express();
app.use(express.json());

const authMiddleware = require("./middleware/authMiddleware.js");

const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

const playerRoutes = require("./routes/playerRoutes.js");
app.use("/api/player", authMiddleware, playerRoutes);

app.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
});