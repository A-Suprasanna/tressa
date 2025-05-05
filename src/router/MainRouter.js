import { createBrowserRouter } from "react-router-dom";
import CategoriesPage from "../pages/CategoriesPage";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import ContactPage from "../pages/ContactPage";
import TraditionalCollectionPage from "../pages/TraditionalCollectionPage ";
import Payment from "../pages/Payment";
import WinterCollectionPage from "../pages/WinterCollectionPage";
import CasualWear from "../pages/CasualWear";
import EthnicWear from "../pages/EthnicWear";
import FormalWear from "../pages/FormalWear";
import PartyWear from "../pages/PartyWear";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CartPage from "../pages/CartPage";
import OrderSummaryPage from "../pages/OrderSummaryPage";

const MainRouter = (user, setUser) => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Layout user={user} />, // Pass user to Layout
      children: [
        { 
          path: "/", 
          element: <Home /> 
        },
        { 
          path: "/categories",
           element: <CategoriesPage /> 
          },
        { 
          path: "/contact",
           element: <ContactPage /> 
          },
        { 
          path: "/traditionals", 
          element: <TraditionalCollectionPage /> 
        },
        {
           path: "/winters",
            element: <WinterCollectionPage /> 
          },
        { 
          path: "/Casuals", 
          element: <CasualWear /> 
        },
        {
           path: "/ethnics",
            element: <EthnicWear /> 
          },
        { 
          path: "/formals", 
          element: <FormalWear />
         },
        {
           path: "/parties", 
           element: <PartyWear /> 
          },
        { 
          path: "/payment", 
          element: <Payment /> 
        },
        { 
          path: "/signup", 
          element: <Signup /> 
        },
        { 
          path: "/login", 
          element: <Login setUser={setUser} /> 
        },
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/ordersummary",
          element: <OrderSummaryPage />,
        },
      ],
    },
  ]);
};

export default MainRouter;
