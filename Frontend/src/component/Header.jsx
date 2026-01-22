import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import AuthService from "../services/authentication.service";
import Swal from "sweetalert2";

const Navbar = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  const handleLogout = () => {
    AuthService.logout();
    setUserInfo(null);
    Swal.fire("Logged out Successfully", "", "success");
  };

  return (
    // src/component/Header.jsx
<div className="navbar bg-base-100/80 backdrop-blur-md shadow-sm px-4 md:px-8">
  <div className="flex-1">
    <Link to="/" className="btn btn-ghost text-2xl font-black tracking-tighter text-primary">
      MERN.BLOG
    </Link>
  </div>
  <div className="flex-none gap-2">
    {userInfo?.username ? (
      <div className="flex items-center gap-4">
        <Link to="/createPost" className="btn btn-primary btn-sm rounded-full">
          + Write Post
        </Link>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar bg-primary text-white">
            {userInfo.username.charAt(0).toUpperCase()}
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><span className="font-bold border-b">{userInfo.username}</span></li>
            <li><button onClick={handleLogout} className="text-error">Logout</button></li>
          </ul>
        </div>
      </div>
    ) : (
      <div className="flex gap-2">
        <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
        <Link to="/register" className="btn btn-primary btn-sm rounded-full">Register</Link>
      </div>
    )}
  </div>
</div>
  );
};

export default Navbar;
