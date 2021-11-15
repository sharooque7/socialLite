import React from "react";
import Topbar from "../topbar/Topbar";
import Sidebar from "../sidebar/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import "./newsfeed.css";
import News from "./News";
import Right from "../rightbar/Rightbar";
import { CircularProgress } from "@mui/material";

const NewsFeed = () => {
  const [feedState, setFeedState] = useState([]);
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(
          "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=7Ld8v4YtapOq59P0Aj5JWfLkAw2OQ6SM"
        );
        setFeedState(res["data"].results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFeed();
  }, []);
  console.log(feedState);

  return (
    <>
      {" "}
      <Topbar />
      <div className="news">
        <Sidebar />
        <div className="newsfeed">
          <div className="newsFeedWrapper">
            {" "}
            {feedState.length <= 0 ? (
              <CircularProgress
                color="inherit"
                size="40px"
                className="loader"
              />
            ) : (
              feedState?.map((p) => <News news={p} />)
            )}
          </div>
        </div>

        <Right />
      </div>
    </>
  );
};

export default NewsFeed;
