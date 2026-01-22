import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostService } from "../services/post.service"; // ตรวจสอบ path ให้ถูก
import Swal from "sweetalert2";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null); // เก็บไฟล์รูปภาพ
  const [preview, setPreview] = useState(null); // เก็บ URL รูปเพื่อแสดงตัวอย่าง
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // ฟังก์ชันจัดการเมื่อเลือกไฟล์รูป
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // สร้าง URL จำลองเพื่อแสดงรูป Preview
    }
  };

  // ฟังก์ชันจัดการเมื่อกด Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation เบื้องต้น
    if (!title || !summary || !content || !file) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่องและอัปโหลดรูปภาพปก",
      });
      return;
    }

    // เตรียมข้อมูลแบบ FormData (สำคัญมากสำหรับการส่งไฟล์)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    formData.append("file", file); // ชื่อ key ต้องตรงกับที่ Backend รับ (req.file)

    try {
      setLoading(true);
      const response = await PostService.createPost(formData);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "สร้างโพสต์ใหม่เรียบร้อยแล้ว",
          timer: 1500,
        });
        navigate("/"); // สร้างเสร็จเด้งกลับหน้าแรก
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถสร้างโพสต์ได้",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow-xl rounded-xl mt-10 border border-base-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title Input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-lg">Title</span>
          </label>
          <input
            type="text"
            placeholder="Title of your article..."
            className="input input-bordered w-full text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Summary Input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-lg">Summary</span>
          </label>
          <input
            type="text"
            placeholder="Short description..."
            className="input input-bordered w-full"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        {/* Image Upload & Preview */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-lg">Cover Image</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full"
            onChange={handleFileChange}
            accept="image/*"
          />
          {/* แสดงรูป Preview ถ้ามีการเลือกไฟล์ */}
          {preview && (
            <div className="mt-4">
              <img 
                src={preview} 
                alt="Cover Preview" 
                className="w-full h-64 object-cover rounded-lg shadow-md border border-base-300" 
              />
            </div>
          )}
        </div>

        {/* Content Textarea */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-lg">Content</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-64 text-base leading-relaxed"
            placeholder="Write your story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className={`btn btn-primary w-full text-lg ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>

      </form>
    </div>
  );
};

export default CreatePost;