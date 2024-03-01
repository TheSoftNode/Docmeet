import dotenv from "dotenv";
import dbConnect from "../Database/MongoDB.js";
import app from "./App.js";

dotenv.config({ path: "./config/config.env" });

// Bring in the connection string
const DB_storage = process.env.DB_storage.replace(
  "<password>",
  process.env.PASSWORD
);

// Create a port
const port = process.env.PORT || 3000;

// Listen to the port
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  //   dbConnect(DB_storage);
});
