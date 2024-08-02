import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Root from "./Root";
import Faqpage from "./pages/Faqpage";
import RegisterPage from "./pages/RegisterPage";

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
      ],
    },
  ]);

  export default router;