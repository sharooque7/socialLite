import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router";
import { logout } from "../../../src/pages/apiCalls";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user, dispatch } = useContext(AuthContext);

  const history = useHistory();
  ///console.log(user);

  useEffect(() => {
    const expiryDate = localStorage.getItem("expiryDate");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setTimeout(() => {
      logout(dispatch);

      history.push("/login");
    }, remainingMilliseconds);
  }, [dispatch, history]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const res = username
        ? await axios({
            method: "GET",
            url: `https://socialliteserver.herokuapp.com/api/posts/profile/${username}`,
            headers: {
              Authorization: "Bearer " + token,
            },
          })
        : await axios({
            method: "GET",
            url: `https://socialliteserver.herokuapp.com/api/posts/all`,
            headers: { Authorization: "Bearer " + token },
          });
      //timeline/all
      ///console.log(res.data);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username !== user?.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
