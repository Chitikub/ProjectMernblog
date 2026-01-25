import React, { useEffect, useState } from "react";
import Post from "../component/Post";
import Swal from "sweetalert2";
import { PostService } from "../services/post.service";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log("useEffect is running...");
    const fetchAllPosts = async () => {
      console.log("fetchAllPosts is starting...");
      try {
        const response = await PostService.getALLPost();
        
        if (response.status === 200) {
          // ตรวจสอบว่าข้อมูลเป็น Array หรือไม่ ถ้าไม่เป็น ให้ลองหา key ชื่อ posts หรือคืนค่าเป็น Array ว่าง
          const result = Array.isArray(response.data) 
            ? response.data 
            : (response.data.posts || []);
            
          setPosts(result);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลโพสต์ได้",
        });
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Blog Posts</h1>

      {/* ใช้ optional chaining ?. เพื่อความปลอดภัย และตรวจสอบว่าเป็น Array จริงๆ */}
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post, index) => (
          <Post key={post._id || index} {...post} />
        ))
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No posts found.</p>
        </div>
      )}
    </div>
  );
};

export default Home;