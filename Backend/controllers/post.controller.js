const PostModel = require("../models/Post");

exports.createPost = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const { title, summary, content } = req.body;
  const authorId = req.authorId;
  
  if (!title || !summary || !content) {
    return res.status(400).send({
      message: "Please provide all fields",
    });
  }
  
  try {
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: req.file.supabaseUrl,
      author: authorId,
    });
    
    if (!postDoc) {
      return res.status(500).send({
        message: "Cannot create a new post",
      });
    }
    res.send({ message: "Create a new post successfully", data: postDoc });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors occurred while registering a new user",
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
      
    if (!posts) {
      return res.status(404).send({
        message: "Post not found",
      });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors occurred while getting posts",
    });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Post Id is missing",
    });
  }
  
  try {
    const post = await PostModel.findById(id).populate("author", ["username"]);
    if (!post) {
      return res.status(404).send({
        message: "Post not found",
      });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors occurred while getting the post",
    });
  }
};

exports.getByAuthorId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: "Author id is missing",
    });
  }
  
  try {
    const posts = await PostModel.find({ author: id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
      
    if (!posts) {
      return res.status(404).send({
        message: "Post not found",
      });
    }
    res.send(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors occurred while getting author's posts",
    });
  }
};

// ---------------------------------------------------------
// ✅✅✅ ส่วนที่แก้ไขให้รองรับการ Update ทั้งแบบเปลี่ยนรูปและไม่เปลี่ยนรูป
// ---------------------------------------------------------
exports.upDatePost = async (req, res) => {
  const { id } = req.params;
  const authorId = req.authorId;

  if (!id) {
    return res.status(400).send({ message: "Post Id is missing" });
  }

  // 1. รับค่าจาก Body
  const { title, summary, content, cover } = req.body;

  // 2. [แก้ตรงนี้] กำหนดรูปภาพที่จะใช้ (รูปใหม่ หรือ รูปเดิม)
  let coverUrl = cover; // เริ่มต้นด้วยรูปเดิม (ถ้าส่งมา)
  
  if (req.file && req.file.supabaseUrl) {
    // ถ้ามีการอัปโหลดไฟล์ใหม่ Middleware จะแปะ URL ไว้ที่นี่
    coverUrl = req.file.supabaseUrl; 
  }

  // 3. [แก้ตรงนี้] ตรวจสอบข้อมูล โดยเช็คที่ coverUrl แทน req.body.cover
  if (!title || !summary || !content || !coverUrl) {
    return res.status(400).send({
      message: "Please provide all fields (title, summary, content, cover)",
    });
  }

  try {
    // 4. อัปเดตข้อมูล
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id, author: authorId },
      { 
        title, 
        summary, 
        content, 
        cover: coverUrl // ใช้ตัวแปรที่คำนวณแล้ว
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send({ 
        message: "Post not found or you are not authorized to edit this post" 
      });
    }

    res.send({ message: "Post updated successfully", data: updatedPost });

  } catch (error) {
    return res.status(500).send({
      message: error.message || "Some errors occurred while updating the post",
    });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const authorId = req.authorId;

  if (!id) {
    return res.status(400).send({
      message: "Post Id is missing",
    });
  }
  
  try {
    const postDoc = await PostModel.findOneAndDelete({
      author: authorId,
      _id: id,
    });
    
    if (!postDoc) {
      return res.status(404).send({ 
        message: "Cannot delete this post (Not found or unauthorized)" 
      });
    }
    
    res.send({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Some errors occurred while deleting the post",
    });
  }
};