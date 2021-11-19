import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import React, { useEffect, useState } from "react";

import "./home.css";

export default function Home() {
  const handle = () => {
    if (!localStorage.justOnce) {
      localStorage.setItem("justOnce", "true");
      window.location.reload();
    }
  };
  return (
    <>
      <Topbar />
      <div className="homeContainer" onLoad={handle}>
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </>
  );
}
