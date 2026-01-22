import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom"; // เพิ่ม Link ตรงนี้
import AuthService from "../services/authentication.service";
import TokenService from "../services/token.service";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  // ดึงค่าออกมาจาก user object เพื่อให้โค้ดด้านล่างใช้งานได้
  const { username, password } = user;

  const { userInfo, setUserInfo } = useContext(UserContext);
  
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(user.username, user.password);

      if (response.status === 200 || response.status === 201) {
        TokenService.setUser(response.data);
        const userData = response.data;

        Swal.fire({
          icon: "success",
          title: "Login successfully",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          setUserInfo({
            id: userData.id || userData._id,
            username: userData.username,
            accessToken: userData.accessToken,
          });
          navigate("/");
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid username or password",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 mt-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl font-black justify-center mb-2 tracking-tight">
            Login
          </h2>
          <p className="text-center text-base-content/60 mb-8 text-sm">
            Please enter your details to sign in.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase opacity-70">Username</span>
              </label>
              <input 
                type="text" 
                name="username" // ใส่ name ให้ตรงกับ handleChange
                placeholder="Your username" 
                className="input input-bordered w-full focus:input-primary bg-base-200/50 border-none px-4"
                value={username} 
                onChange={handleChange} // ใช้ handleChange ฟังก์ชันเดียวจัดการทั้งหมด
                required 
              />
            </div>

            <div className="form-control w-full">
              <label className="label flex justify-between">
                <span className="label-text font-bold text-xs uppercase opacity-70">Password</span>
              </label>
              <input 
                type="password" 
                name="password" // ใส่ name ให้ตรงกับ handleChange
                placeholder="••••••••" 
                className="input input-bordered w-full focus:input-primary bg-base-200/50 border-none px-4"
                value={password}
                onChange={handleChange} // ใช้ handleChange ฟังก์ชันเดียวจัดการทั้งหมด
                required 
              />
            </div>

            <div className="form-control mt-8">
              <button className="btn btn-primary w-full text-white shadow-lg hover:shadow-primary/30 transition-all">
                Sign In
              </button>
            </div>
          </form>

          <div className="divider text-xs opacity-40">OR</div>
          
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline transition-all">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;