import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // ต้องมี Link
import { PostService } from "../services/post.service";
const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getById(id);
        if (response.status === 200) {
          setPost(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-base-100 shadow-xl rounded-2xl overflow-hidden relative">
        
        {/* --- รูปปก --- */}
        <figure className="w-full h-64 md:h-96 relative">
          <img
            src={post.cover || "https://via.placeholder.com/800x400"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          
          {/* ปุ่มย้อนกลับ */}
          <div className="absolute top-4 left-4">
            <Link to="/" className="btn btn-circle btn-neutral bg-opacity-70 border-none text-white">
              ❮
            </Link>
          </div>

          {/* ✅✅✅ ปุ่มแก้ไข (EDIT BUTTON) อยู่ตรงนี้ ✅✅✅ */}
          <div className="absolute top-4 right-4">
            <Link to={`/edit/${post._id}`} className="btn btn-warning gap-2 shadow-lg">
              ✏️ Edit Post
            </Link>
          </div>

        </figure>

        {/* --- เนื้อหา --- */}
        <div className="p-8 md:p-12">
           <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
           <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;