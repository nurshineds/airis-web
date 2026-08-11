const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/authRoute");

//contentRoutes tambah disini ψ(._. )>
const contentRoutes = require("./routes/contentRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);

//contentRoute ❤️
app.use("/api/content", contentRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend Running Kidsssss\nHORE RUNNING"
    });
});
module.exports = app;
