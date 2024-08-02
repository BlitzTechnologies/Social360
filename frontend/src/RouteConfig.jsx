import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Root from "./Root";
import Faqpage from "./pages/Faqpage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage"
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
      ],
    },
  ]);

  export default router;