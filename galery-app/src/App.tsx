import "./App.css";
import React from "react";
import History from "./routes/history/History";
import MainPage from "./routes/main/MainPage";
import {
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { loader as MainLoader } from "./routes/main/MainPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      loader: MainLoader,
    },
    {
      path: "/history",
      element: <History />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
