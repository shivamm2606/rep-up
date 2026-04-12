import "dotenv/config";
import ConnectDB from "./config/db.js";
import app from "./app.js";

const port = process.env.PORT || 8000;

ConnectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
