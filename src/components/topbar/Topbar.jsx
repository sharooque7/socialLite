import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { logout } from "../../../src/pages/apiCalls";

export default function Topbar() {
  const history = useHistory();
  const { user, dispatch } = useContext(AuthContext);
  const [userState, setState] = useState({});

  useEffect(() => {
    const token =
      JSON.parse(localStorage.getItem("user")) !== null
        ? JSON.parse(localStorage.getItem("user")).token
        : "null";
    const fetch = async () => {
      const res = await axios({
        method: "GET",
        url: `https://socialliteserver.herokuapp.com/api/users?userId=${user?._id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(res);
      setState(res.data);
    };

    fetch();
  }, [user]);
  console.log(user);

  const handleClick = () => {
    logout(dispatch);
    history.push("/login");
  };

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">SocialMediaLight</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <span className="topbarLink">Homepage</span>
          </Link>
          {/* <Link to="/" style={{ textDecoration: "none", color: "white" }}> */}
          {/* <span className="topbarLink">Timeline</span> */}
          <span onClick={handleClick} className="topbarLink">
            Logout
          </span>
          {/* </Link> */}
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="profmodal"></span>
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${userState.username}`}>
          {" "}
          <img
            src={
              userState.profilePicture
                ? PF + userState.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt="NoAvatar"
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
