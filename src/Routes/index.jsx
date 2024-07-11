import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register"
import HomeLayout from "../Layouts/HomeLayout";
import ProfileLayout from "../Layouts/ProfileLayout";
import ConnectionsLayout from "../Layouts/ConnectionsLayout";
import MessagesLayout from "../Layouts/MessagesLayout";
import NotificationsLayout from "../Layouts/NotificationsLayout";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <HomeLayout />,
    },
    {
      path: "/profile",
      element: <ProfileLayout />,
    },
    {
      path: "/connections",
      element: <ConnectionsLayout />,
    },
    {
      path: "/messages",
      element: <MessagesLayout />,
    },
    {
      path: "/notifications",
      element: <NotificationsLayout />,
    },
  ]);