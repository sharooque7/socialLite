import "./register.css";
import { useRef, useState, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { sign } from "../apiCalls";
export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [error, setError] = useState({ error: false });

  const { user, isFetching, dispatch } = useContext(AuthContext);
  // const token = JSON.parse(localStorage.getItem("user")).token;

  // const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(passwordAgain.current.value);
    console.log(password.current.value);
    if (passwordAgain.current.value !== password.current.value) {
      setError({ error: true });
      setTimeout(() => {
        setError({ error: false });
      }, 5000);
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        passwordAgain: passwordAgain.current.value,
      };
      try {
        await axios({
          method: "POST",
          url: "https://socialliteserver.herokuapp.com/api/auth/register",
          data: user,
        });
        sign(dispatch);
        history.push("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleRedirect = () => {
    history.push("/login");
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social Lite</h3>
          <span className="loginDesc">
            Post and chat spend time with people online Social Lite.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              className="loginInput"
              ref={username}
              type="text"
              required
            />
            <input
              placeholder="Email"
              className="loginInput"
              ref={email}
              type="email"
              required
            />
            <input
              placeholder="Password"
              className="loginInput"
              type="password"
              ref={password}
              required
              minLength="6"
            />
            <input
              placeholder="Confirm Password"
              className="loginInput"
              type="password"
              ref={passwordAgain}
              required
              minLength="6"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            {error.error ? (
              <p style={{ color: "red", textAlign: "center" }}>
                Password not same
              </p>
            ) : null}
            <button className="loginRegisterButton" onClick={handleRedirect}>
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
