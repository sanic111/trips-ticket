import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div>home</div>
      <button onClick={() => navigate("/search")}></button>
    </div>
  );
}

export default Home;
