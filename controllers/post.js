import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  console.log("token:", token);
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log("userId:" + userId);

    const q =
      userId !== "undefined"
        ? `select p.*, u.id AS userId, u.name, u.profilePic
        from posts AS p JOIN users AS u on u.id = p.userId
        WHERE p.userId = ?
        ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `INSERT INTO posts ("desc","img", "userId", "createAt") VALUE (?)`;

    const values = [
      req.body.desc,
      req.body.img,
      req.body.userId,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });

  // const q = `SELECT p.*, u.id AS userId, name, coverPic, profilePic, city, website FROM posts AS p JOIN users AS u ON (u.id = p.userId)`;
};