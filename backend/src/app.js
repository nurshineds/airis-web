const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/authRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
// TULIS KODE UNTUK MENAMBAHKAN ROUTING CONTOHNYA KAYA DI BARIS ATAS INI, FORMAT PENAMAAN ROUTINGNYA /API/CONTENT

app.get("/", (req, res) => {
    res.json({
        message: "Backend Running Kidsssss"
    });
});
module.exports = app;