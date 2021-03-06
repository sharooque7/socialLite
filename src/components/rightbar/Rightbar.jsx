import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Fastfood, Remove } from "@mui/icons-material";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  console.log(currentUser);
  console.log(user);
  // const [followed, setFollowed] = useState("");
  const [followed, setFollowed] = useState(
    user ? currentUser.followings.includes(user?._id) : false
  );

  // useEffect(() => {
  //   setFollowed(user ? currentUser.followings.includes(user?._id) : false);
  // }, []);

  useEffect(() => {
    const getFriends = async () => {
      const token = JSON.parse(localStorage.getItem("user")).token;

      // console.log(token);
      try {
        const friendList = await axios({
          method: "GET",
          url:
            "https://socialliteserver.herokuapp.com/api/users/friends/" +
            user?._id,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setFriends(friendList.data);
      } catch (err) {
        // console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    const token = JSON.parse(localStorage.getItem("user")).token;

    // console.log(currentUser._id);
    // console.log(user?._id);
    const data = { userId: currentUser?._id };
    try {
      if (followed) {
        await axios({
          method: "PUT",
          url: `https://socialliteserver.herokuapp.com/api/users/${user?._id}/unfollow`,
          data: data,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setFollowed(false);
        await dispatch({ type: "UNFOLLOW", payload: user?._id });
      } else {
        await axios({
          method: "PUT",
          url: `https://socialliteserver.herokuapp.com/api/users/${user?._id}/follow`,
          data: data,
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        // console.log(followed);
        setFollowed(true);
        await dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (err) {
      // console.log(err);
      // setFollowed(!followed);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={PF + "/gift.png"} alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src={PF + "/ad.png"} alt="" />
        {/* <h4 className="rightbarTitle">Online Friends</h4> */}
        {/* <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul> */}
      </>
    );
  };

  const ProfileRightbar = () => {
    const [state, setState] = useState(true);
    const city = useRef("");
    const from = useRef("");
    const relation = useRef("");

    const updatecity = async (value, type) => {
      const token = JSON.parse(localStorage.getItem("user")).token;
      setState(!state);
      if (
        (type === "update" && city.current.value !== "") ||
        from.current.value !== "" ||
        relation.current.value !== ""
      ) {
        try {
          const data = {
            city: city.current.value,
            from: from.current.value,
            relationship: relation.current.value,
            userId: currentUser?._id,
          };
          // console.log(data);
          await axios({
            method: "PUT",
            url: `https://socialliteserver.herokuapp.com/api/users/${currentUser?._id}`,
            data: data,
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          window.location.reload();
        } catch (error) {
          // console.log(error);
        }
      }
    };
    return (
      <>
        {user?._id !== currentUser?._id && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
            <input className="city" type="text" disabled={state} ref={city} />
            {currentUser?._id === user._id && (
              <button
                onClick={(e) => {
                  updatecity(
                    "city",
                    city.current.value,
                    state ? "edit" : "update"
                  );
                }}
              >
                {state ? "edit" : "update"}
              </button>
            )}
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
            <input className="city" type="text" disabled={state} ref={from} />
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship}</span>
            <input
              className="city"
              type="text"
              disabled={state}
              ref={relation}
            />
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + "/" + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
