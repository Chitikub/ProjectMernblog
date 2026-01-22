import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import AuthService from "../services/authentication.service";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  // ดึงค่า username และ password ออกมาจาก user object เพื่อให้โค้ดด้านล่างใช้งานได้
  const { username, password } = user;

  // --- เช็คว่าถ้า Login อยู่แล้ว ให้ดีดไปหน้าแรก ---
  useEffect(() => {
    if (userInfo?.username) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username and password are required!",
      });
      return;
    }

    try {
      // เรียกใช้ register service
      const response = await AuthService.register(username, password);
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Registration successful!",
          text: response.data.message || "You can now login.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 mt-10">
      {/* Card หลัก: สไตล์เดียวกับหน้า Login เพื่อความต่อเนื่อง */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-8">
          
          <h2 className="card-title text-3xl font-black justify-center mb-2 tracking-tight">
            Register
          </h2>
          <p className="text-center text-base-content/60 mb-8 text-sm">
            Create your account to start blogging.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase opacity-70">Username</span>
              </label>
              <input 
                type="text" 
                name="username" // ต้องระบุ name เพื่อให้ handleChange ทำงาน
                placeholder="Choose a username" 
                className="input input-bordered w-full focus:input-primary bg-base-200/50 border-none px-4"
                value={username}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase opacity-70">Password</span>
              </label>
              <input 
                type="password" 
                name="password" // ต้องระบุ name เพื่อให้ handleChange ทำงาน
                placeholder="••••••••" 
                className="input input-bordered w-full focus:input-primary bg-base-200/50 border-none px-4"
                value={password}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-control mt-8">
              <button className="btn btn-primary w-full text-white shadow-lg hover:shadow-primary/30 transition-all">
                Register
              </button>
            </div>
          </form>

          <div className="divider text-xs opacity-40">OR</div>
          
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;