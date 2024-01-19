import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  homeLoader,
  brandLoader,
  blogHomeLoader,
  blogHomeIndexLoader,
  blogPreviewLoader,
  documentViewLoader,
  videoListLoader,
} from "./loaders/loaders";
import { BrandPage } from "./pages/brand.page";
import { BrandIndexPage } from "./pages/brand.index.page";
import { BlogHomePage } from "./pages/blog.home.page";
import { BlogHomeIndexPage } from "./pages/blog.home.index.page";
import { BlogHomeItemPage } from "./pages/blog.home.item.page";
import { DocumentViewPage } from "./pages/document.view.page";
import { VideoListPage } from "./layouts/pages/video.list.page";
import ErrorPage from "./pages/error.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BrandPage />,
    errorElement: <ErrorPage />,
    loader: homeLoader,
    children: [
      {
        path: "blogs",
        element: <BlogHomePage />,
        loader: blogHomeLoader,
        children: [
          {
            path: "page/:date",
            element: <BlogHomeItemPage />,
            loader: blogPreviewLoader,
          },
          {
            element: <BlogHomeIndexPage />,
            loader: blogHomeIndexLoader,
            index: true,
          },
        ],
      },
      {
        path: "document/:doc_id",
        element: <DocumentViewPage />,
        loader: documentViewLoader,
      },
      {
        path: "page/videos",
        element: <VideoListPage />,
        loader: videoListLoader,
      },
      { index: true, element: <BrandIndexPage />, loader: brandLoader },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
