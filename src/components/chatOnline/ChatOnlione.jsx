import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    console.log(currentId);
    const getFriends = async () => {
      const res = await axios({
        method: "GET",
        url:
          "https://socialliteserver.herokuapp.com/api/users/friends/" +
          currentId,
        headers: { Authorization: "Bearer " + token },
      });
      setFriends(res.data);

      console.log(currentId);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    try {
      const res = await axios({
        method: "GET",
        url: `https://socialliteserver.herokuapp.com/api/conversation/find/${currentId}/${user._id}`,
        headers: { Authorization: "Bearer " + token },
      });

      const con = await axios({
        method: "GET",
        // url: `http://localhost:5000/api/conversation/${userId}`,
        url: `https://socialliteserver.herokuapp.com/api/conversation/${currentId}`,
        headers: { Authorization: "Bearer " + token },
      });

      const dup = con.data.findIndex((p) => {
        if (
          p["members"].includes(currentId) &&
          p["members"].includes(user._id)
        ) {
          return p;
        }
      });

      if (dup < 0) {
        const data = await axios({
          method: "POST",
          // url: "http://localhost:5000/api/conversation",
          url: "https://socialliteserver.herokuapp.com/api/conversation",
          data: {
            senderId: currentId,
            receiverId: user._id,
          },
          headers: { Authorization: "Bearer " + token },
        });
        console.log(data);
      }

      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
