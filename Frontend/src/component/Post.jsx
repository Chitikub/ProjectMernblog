import React from "react";
import { Link } from "react-router-dom";

// รับค่าโดยตรงจากสิ่งที่ spread มาจาก Home.jsx
// src/component/Post.jsx
const Post = ({ title, createdAt, author, summary, cover, _id }) => {
  return (
    <div className="card md:card-side bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 overflow-hidden group">
      <figure className="md:w-72 h-48 md:h-auto overflow-hidden">
        <img
          src={cover || "https://via.placeholder.com/400x300"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </figure>
      <div className="card-body p-6">
        <div className="flex gap-2 text-xs font-semibold text-primary uppercase">
          <span>{author?.username || "Admin"}</span>
          <span>•</span>
          <span className="text-base-content/50">{createdAt}</span>
        </div>
        <h2 className="card-title text-2xl font-bold group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-base-content/70 line-clamp-2">{summary}</p>
        <div className="card-actions justify-end mt-4">
          <Link to={`/post/${_id}`} className="btn btn-link btn-primary no-underline group-hover:underline">
            Read Full Story →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
