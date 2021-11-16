import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function Profile() {
  const username = useParams().username;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const token = JSON.parse(localStorage.getItem("user")).token;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios({
        method: "GET",
        url: `https://socialliteserver.herokuapp.com/api/users?username=${username}`,
        headers: { Authorization: "Bearer " + token },
      });
      setUser(res.data);
    };
    fetchUser();
  }, [username, token]);

  /// @desc change profile and coverimage
  const updateProfilePhoto = async (e, type) => {
    console.log(type);
    e.preventDefault();
    const filedata = e.target.files[0];
    console.log("Hi");
    const img = { userId: user._id };

    if (filedata) {
      console.log("Hi");
      const formData = new FormData();
      const fileName = Date.now() + filedata.name;
      formData.append("name", fileName);
      formData.append("file", filedata);
      type === "profile"
        ? (img.profilePicture = fileName)
        : (img.coverPicture = fileName);

      try {
        await axios({
          method: "post",
          url: "https://socialliteserver.herokuapp.com/api/upload",
          data: formData,
          headers: { Authorization: "Bearer " + token },
        });
      } catch (error) {
        console.log(error);
      }
    }

    try {
      await axios({
        method: "PUT",
        url: `https://socialliteserver.herokuapp.com/api/users/${user._id}`,
        data: img,
        headers: { Authorization: "Bearer " + token },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <label htmlFor="cover">
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="cover"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => {
                    updateProfilePhoto(e, "cover");
                  }}
                />
                <img
                  className="profileCoverImg"
                  src={
                    user.coverPicture
                      ? PF + "/" + user.coverPicture
                      : PF + "/noAvatar.png"
                  }
                  alt=""
                />
              </label>
              <label htmlFor="profile">
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="profile"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => {
                    updateProfilePhoto(e, "profile");
                  }}
                />
                <img
                  className="profileUserImg"
                  src={
                    user.profilePicture
                      ? PF + "/" + user.profilePicture
                      : PF + "/noAvatar.png"
                  }
                  alt=""
                />
              </label>

              {/* Testing space */}

              {/* Test Ending space */}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
