import api from "./api"; 

// ใช้วิธีเรียก API_URL แบบนี้จะปลอดภัยกว่า
const API_URL = "/post"; 

const getALLPost = async () => {
  return await api.get(API_URL);
};

const getById = async (id) => {
  return await api.get(`${API_URL}/${id}`);
};

const getByAuthorId = async (id) => {
  return await api.get(`${API_URL}/author/${id}`);
};

const createPost = async (formData) => {
  return await api.post(API_URL, formData, {
    headers: {
      // ✅ Trick: ตั้งเป็น "multipart/form-data" ได้สำหรับ POST แต่ถ้าลบออก axios ก็ฉลาดพอที่จะเติมให้
      "Content-Type": "multipart/form-data",
    },
  });
};

// 👇👇👇 จุดแก้ไขสำคัญที่สุด (Update Post) 👇👇👇
const updatePost = async (id, formData) => {
  return await api.put(`${API_URL}/${id}`, formData);
   };
// 👆👆👆 จบส่วนแก้ไข 👆👆👆

const deletePost = async (id) => {
  return await api.delete(`${API_URL}/${id}`);
};

export const PostService = {
  getALLPost,
  getById,
  getByAuthorId,
  createPost,
  updatePost,
  deletePost,
};