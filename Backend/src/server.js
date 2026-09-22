require("dotenv").config();
const app = require("./app");
const http = require("http");
const PORT = process.env.PORT || 5000;
const {
    testConnection
  } = require("./config/db");
const server = http.createServer(app);

const startServer = async () => {
  try {
    await testConnection();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    }
    );
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

startServer();