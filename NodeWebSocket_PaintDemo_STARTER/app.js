// ================================
// app.js (Node + Express + Socket.io)
// Multi-user drawing relay server
// ================================

// Import Libraries and Setup
import express from "express";
import http from "http";
import { Server } from "socket.io";

//// REMOVE IF YOU PUT ON RENDER //////
// 'open' is ONLY for local development (auto-open browser).
// If you host online (e.g. Render), you should REMOVE/COMMENT these lines.
import open from "open";
//// REMOVE IF YOU PUT ON RENDER //////

// Create an Express app (handles HTTP requests like serving files)
const app = express();

// Socket.io needs an HTTP server, so we create one using Express app
const server = http.createServer(app);

// Create a Socket.io server that uses the HTTP server
const io = new Server(server);

// IMPORTANT for hosting:
// - On Render, the platform sets process.env.PORT for you.
// - Locally, we fallback to 3500.
const port = process.env.PORT || 3500;

// Tell our Node.js server to host our P5.JS sketch from the "public" folder
// Example: public/index.html, public/sketch.js etc.
app.use(express.static("public"));

// Start the HTTP server
server.listen(port, () => {
  console.log("listening on: " + port);
});

//// REMOVE IF YOU PUT ON RENDER //////
// Open in browser: local dev environment only!
// On Render (or any online host), there is no "your local browser" to open.
await open(`http://localhost:${port}`);
//// REMOVE IF YOU PUT ON RENDER //////

// ================================
// Socket.io: Real-time connections
// ================================

// This runs every time a client (browser tab/device) connects
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  // --------------------------------
  // MULTI-USER DRAWING (core logic)
  // --------------------------------
  // Listen for drawing data from ONE client
  // The client emits: socket.emit("drawing", {xpos, ypos, userS})
  socket.on("drawing", (data) => {
    // Debug: see incoming data in the terminal
    // (useful to confirm your front-end is actually sending)
    // Example data: { xpos: 120, ypos: 200, userS: 30 }
    console.log("drawing data received from", socket.id, data);

    // Broadcast the drawing data to ALL OTHER connected clients
    // (broadcast = send to everyone except the sender)
    socket.broadcast.emit("drawing", data);

    // If you wanted everyone INCLUDING the sender to receive it, use:
    // io.emit("drawing", data);
  });

  // Optional: handle disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});
