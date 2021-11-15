import "./register.css";
import { useRef } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useHistory } from "react-router";
export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  // const token = JSON.parse(localStorage.getItem("user")).token;

  // const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Password don't match!");
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
          url: "/api/auth/register",
          data: { user },
        });
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
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Hey Let's connect through my light weight social media
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
            <button className="loginRegisterButton" onClick={handleRedirect}>
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
