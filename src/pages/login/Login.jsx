import "./login.css";
import { useRef, useState } from "react";
import { loginCall } from "../apiCalls";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const [errorState, setErroState] = useState(false);
  const { user, isFetching, sign, dispatch } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
    } catch (error) {
      //console.log("error");
      setErroState(true);
      setTimeout(() => {
        setErroState(false);
      }, 5000);
    }
  };
  //console.log(user);
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <div className="sample">
            <span>Sample Credentials</span>
            <span>ozil@gmail.com Arsenal</span>
            <span>Lukita@gmail.com Madrid10</span>
            <span>Leo@gmail.com Barcelona</span>
          </div>
          <h3 className="loginLogo">Social Lite</h3>
          <span className="loginDesc">
            Post and chat spend time with people online Social Lite.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              placeholder="Email"
              className="loginInput"
              type="email"
              ref={email}
              required
            />
            <input
              placeholder="Password"
              className="loginInput"
              type="password"
              ref={password}
              minLength="6"
              required
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            {user === null && errorState ? (
              <p style={{ color: "red", textAlign: "center" }}>
                Please register / use correct credential
              </p>
            ) : (
              ""
            )}
            {sign ? (
              <p style={{ color: "green", textAlign: "center" }}>
                Registered Successfully
              </p>
            ) : null}

            <span className="loginForgot">Forgot Password?</span>
            <Link
              to="/register"
              style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                textDecoration: "none",
              }}
            >
              <button className="loginRegisterButton">
                {isFetching ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  " Create a New Account"
                )}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
