import app from "./app.js";
import fs from "fs";
import connectDB from "./config/database.js";

// Handle uncaught exceptions

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to uncaught exception`);
  process.exit(1);
});

// Load env vars
if (!fs.existsSync("./.env")) {
  console.log("Creating .env file");
  const src = "../config.txt";
  const dest = "./.env";
  fs.copyFileSync(src, dest);
}

import dotenv from "dotenv";
dotenv.config();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}.`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to unhandled promise rejection`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
