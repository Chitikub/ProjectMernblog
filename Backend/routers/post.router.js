const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require("../Middleware/authCT.middleware");
const { upload, uploadToSupabase } = require("../Middleware/file.middleware");

//http://localhost:5000/api/v1/post
router.post(
  "",
  authJwt.verifyToken,
  upload,
  uploadToSupabase,
  postController.createPost
);

//http://localhost:5000/api/v1/post
router.get("", postController.getPosts);

//http://localhost:5000/api/v1/post/1
router.get("/:id", postController.getById);

//http://localhost:5000/api/v1/post/author/1
router.get("/author/:id", postController.getByAuthorId);

// -------------------------------------------------------------------------
// ✅✅✅ แก้ไขตรงนี้ครับ (เพิ่ม upload และ uploadToSupabase) ✅✅✅
// -------------------------------------------------------------------------
router.put(
  "/:id", 
  authJwt.verifyToken, 
  upload,            // <--- ต้องใส่เพื่อรับ FormData (แก้ req.body undefined)
  uploadToSupabase,  // <--- ต้องใส่เพื่ออัปโหลดรูปใหม่ (ถ้ามี)
  postController.upDatePost
);

//http://localhost:5000/api/v1/post/1
router.delete("/:id", authJwt.verifyToken, postController.deletePost);

module.exports = router;