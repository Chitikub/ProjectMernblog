const jwt = require("jsonwebtoken");
// ไม่ต้อง require("dotenv").config() ตรงนี้ก็ได้ถ้ามีใน index.js แล้ว 
// แต่ใส่ไว้ก็ไม่เสียหายครับ

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  
  // ดึงค่า secret ข้างในนี้เพื่อให้ได้ค่าที่อัปเดตที่สุด
  const secret = process.env.SECRET; 

  if (!token) {
    return res.status(401).send({ message: "Token is missing" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      // ปรับให้ส่ง err.message ออกมาดู จะได้รู้ว่าพังเพราะอะไร
      return res.status(403).send({ message: err.message }); 
    }
    req.username = decoded.username;
    req.authorId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;