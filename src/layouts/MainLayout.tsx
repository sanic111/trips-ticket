// import BottomNavBar from "@/components/BottomNavBar/BottomNavBar";
import { Outlet } from "react-router-dom";
import React from "react";

function MainLayout() {
  return (
    <div style={{ width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>
      <main style={{ width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
