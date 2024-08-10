import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Root from "./Root";
import Faqpage from "./pages/Faqpage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage"
import ContactPage from "./pages/ContactPage";
import MainVideo from "./components/videoTech/MainVideo";
import CreateRoomPage from "./pages/CreateRoomPage"
import JoinRoomPage from "./pages/JoinRoomPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "FAQ",
        element: <Faqpage />,
      },
      {
        path: "Register",
        element: <RegisterPage />,
      },
      {
        path: "Login",
        element: <LoginPage />,
      },
      {
        path: "Contact",
        element: <ContactPage />,
      },
      {
        path: "CreateRoom",
        element: <CreateRoomPage />,
      },
      {
        path: "JoinRoom",
        element: <JoinRoomPage />,
      },
      {
        path: "Video",
        element: <MainVideo />,
      },
    ],
  },
]);

export default router;