const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/authRoute");
const contentRoutes = require("./routes/contentRoute");
const geminiRoutes = require("./routes/geminiRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/generate", geminiRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend Running Kidsssss\nHORE RUNNING"
    });
});
module.exports = app;
