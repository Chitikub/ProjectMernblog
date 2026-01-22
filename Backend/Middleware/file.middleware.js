const multer = require("multer");
const path = require("path");
const supabaseConfig = require("../config/supabase.config");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("file");

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extName = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extName) {
    console.log("file accepted");
    return cb(null, true);
  } else {
    cb("Error: Images only!!");
  }
}

async function uploadToSupabase(req, res, next) {
  if (!req.file) {
    next();
    return;
  }

  try {
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}${fileExt}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    req.file.supabaseUrl = publicUrl;
    console.log("Upload Success! Public URL:", req.file.supabaseUrl);
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while uploading to supabase",
    });
  }
}

module.exports = { upload, uploadToSupabase };