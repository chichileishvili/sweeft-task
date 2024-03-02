import "./App.css";
import React from "react";
import History from "./routes/history/History";
import MainPage from "./routes/main/MainPage";
import PhotoPage from "./routes/photo/PhotoPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
    },
    {
      path: "/history",
      element: <History />,
    },
    {
      path: "/photo/:id",
      element: <PhotoPage />,
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
