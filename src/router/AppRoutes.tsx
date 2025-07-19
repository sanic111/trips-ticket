import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
// import Home from "@/pages/Home/Home";
import SearchPage from "@/pages/SearchPage/SearchPage";
// import History from "@/pages/History/History";
// import Loader from "@/components/Loader/Loader";

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    {/* <Suspense fallback={<Loader />}> */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<SearchPage />} />
          {/* <Route path="/search" element={<SearchPage />} /> */}
          {/* <Route path="/history" element={<History />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    {/* </Suspense> */}
  </BrowserRouter>
);

export default AppRoutes;
