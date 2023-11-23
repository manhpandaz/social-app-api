import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `email` = ?,`name` = ?, `coverPic`=?, `profilePic` = ?, `city`=?, `website`=? where `id` = ?";

    db.query(
      q,
      [
        req.body.email,
        req.body.name,
        req.body.coverPic,
        req.body.profilePic,
        req.body.city,
        req.body.website,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data?.affectedRows > 0) return res.status(200).json("Updated");
        return res.status(403).json("you can update only your post");
      }
    );
  });
};
