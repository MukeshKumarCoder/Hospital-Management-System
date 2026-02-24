import express from "express";
import cors from "cors";
import "dotenv/config";

import { clerkMiddleware } from "@clerk/express";
import { connection } from "./Config/DB.js";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Database connection
connection();

// Routes

app.get("/", (req, res) => {
  res.send("Welcome to Hospital Management System");
});

app.listen(port, () => {
  console.log(`app is running at port ${port}`);
});
