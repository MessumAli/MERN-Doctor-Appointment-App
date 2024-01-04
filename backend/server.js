// Import necessary libraries, modules and routes

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import patientRoute from "./routes/patientRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupStaticFiles } from "./utils/staticFile.js";

// Configurations

const app = express();
dotenv.config();
mongoose.set("strictQuery", false);
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const httpServer = createServer(app);

// Middlewares

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser(process.env.JWT_SECRET_KEY));

// Setup to serve static files

setupStaticFiles(app);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/doctor", doctorRoute);
app.use("/api/v1/patient", patientRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/appointment", appointmentRoute);

// Function to connect to the MongoDB database

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully");
    startServer();
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

// Initialize a socket.io server

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Define socket.io events

io.on("connection", (socket) => {
  socket.on("onAllUpcoming", (data) => {
    io.emit("allUpcoming", data);
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

// Function to start the Express server

function startServer() {
  httpServer.listen(process.env.PORT, (err) => {
    if (err) {
      console.error("Error starting the server", err);
    } else {
      console.log("Server is running Successfully at", process.env.PORT);
    }
  });
}

// Call the function to connect to the database
connectToDatabase();