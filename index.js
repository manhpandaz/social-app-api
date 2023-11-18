import express from "express";
// const express = require("express");
const app = express();

import authRouters from "./routes/auth.js";
import commentRouters from "./routes/comments.js";
import likeRouters from "./routes/likes.js";
import postRouters from "./routes/posts.js";
import userRouters from "./routes/users.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

//
app.use("/api/auth", authRouters);
app.use("/api/users", userRouters);
app.use("/api/posts", postRouters);
app.use("/api/likes", likeRouters);
app.use("/api/comments", commentRouters);

app.listen(8080, () => {
  console.log("API working!");
});
