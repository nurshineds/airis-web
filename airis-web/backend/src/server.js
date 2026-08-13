require("dotenv").config();

const app = require("./app");
const { startConsumer } = require('./services/consumer');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT} yahh`);
    startConsumer();
});