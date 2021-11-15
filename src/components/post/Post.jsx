import "./post.css";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser["user"]._id));
  }, [currentUser, post.likes]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const res = await axios({
        method: "GET",
        url: `https://socialliteserver.herokuapp.com/api/users?userId=${post.userId}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(res.data);
      setUser(res.data);
    };
    fetchUsers();
  }, [post.userId]);

  const likeHandler = () => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    try {
      axios({
        method: "PUT",
        url: `https://socialliteserver.herokuapp.com/api/posts/${post._id}/like`,
        data: { userId: currentUser["user"]._id },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deletePost = async (post) => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    console.log(post);
    console.log(currentUser["user"]._id);
    try {
      await axios({
        method: "delete",
        url: `https://socialliteserver.herokuapp.com/api/posts/${post}`,
        data: { userId: currentUser["user"]._id },
        headers: { Authorization: "Bearer " + token },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "/person/noAvatar.png"
                }
                alt="NoAvatar"
                className="topbarImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {post.userId === currentUser["user"]._id && (
              <DeleteIcon
                style={{ cursor: "pointer" }}
                onClick={() => {
                  deletePost(post._id);
                }}
              />
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={`${PF}/${post.img}`} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}/like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}/heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
