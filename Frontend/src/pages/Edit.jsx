import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostService } from "../services/post.service";
import Swal from "sweetalert2";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ประกาศตัวแปรสำหรับเก็บค่าที่จะแก้ไข
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(""); 
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getById(id);
        if (response.status === 200) {
          const postData = response.data;
          // ดึงค่ามาใส่ในตัวแปร state ทีละตัว
          setTitle(postData.title);
          setSummary(postData.summary);
          setContent(postData.content);
          setCover(postData.cover); 
        }
      } catch (error) {
        navigate("/");
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    
    // 👇👇👇 เพิ่มบรรทัดนี้ครับ สำคัญมาก! 👇👇👇
    // ต้องส่งรูปเดิมไปด้วย เผื่อกรณีไม่ได้อัปรูปใหม่ Backend จะได้มีค่าเดิมไปใช้
    formData.append("cover", cover); 

    // ถ้ามีการเลือกไฟล์ใหม่ ให้ส่งไฟล์ไป
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await PostService.updatePost(id, formData);
      if (response.status === 200) {
        Swal.fire("สำเร็จ", "แก้ไขบทความเรียบร้อย", "success");
        navigate(`/post/${id}`);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow-xl rounded-xl mt-10 border border-base-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-warning">Edit Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div className="form-control">
          <label className="label font-bold">Title</label>
          <input 
            type="text" 
            className="input input-bordered w-full" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        {/* Summary */}
        <div className="form-control">
          <label className="label font-bold">Summary</label>
          <input 
            type="text" 
            className="input input-bordered w-full" 
            value={summary} 
            onChange={(e) => setSummary(e.target.value)} 
          />
        </div>

        {/* Image */}
        <div className="form-control">
          <label className="label font-bold">Cover Image</label>
          <input 
            type="file" 
            className="file-input file-input-bordered file-input-warning w-full" 
            onChange={handleFileChange} 
          />
          
          {/* ส่วนแสดงรูปภาพ (Preview) */}
          <div className="mt-4">
             <p className="text-sm mb-2">Current / Preview:</p>
             {/* แก้ตรงนี้: ใช้ preview หรือ cover (ห้ามใช้ post.cover) */}
             <img 
               src={preview || cover || "https://via.placeholder.com/800x400"} 
               alt="Cover Preview" 
               className="h-48 object-cover rounded shadow-md" 
             />
          </div>
        </div>

        {/* Content */}
        <div className="form-control">
          <label className="label font-bold">Content</label>
          <textarea 
            className="textarea textarea-bordered h-40 text-lg" 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* ปุ่ม Submit */}
        <button type="submit" className="btn btn-warning w-full text-lg">
          Update Post
        </button>

      </form>
    </div>
  );
};

export default Edit;