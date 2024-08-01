import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Root from "./Root";
import Faqpage from "./pages/Faqpage";

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
      ],
    },
  ]);

  export default router;