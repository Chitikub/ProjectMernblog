import { createBrowserRouter } from "react-router-dom";
import Layout from "../component/Layout";
import Home from "../pages/Home";
import Edit from "../pages/Edit";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Postdetail from "../pages/Postdetail";
import Author from "../pages/Author";
import Post from "../component/Post";
import CreatePost from "../pages/CreatePost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "edit/:id", element: <Edit /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "author/:id", element: <Author /> },
      { path: "post", element: <Post /> },
      { path: "post/:id", element: <Postdetail /> },
      { path: "CreatePost", element: <CreatePost /> },
    ],
  },
]);

export default router;
