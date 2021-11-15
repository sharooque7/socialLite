import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      "https://socialliteserver.herokuapp.com/api/auth/login",
      userCredential
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    // localStorage.setItem("user", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};

export const logout = async (dispatch) => {
  localStorage.removeItem("expiryDate");
  localStorage.removeItem("user");
  dispatch({ type: "LOGOUT" });
};