import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      "https://socialliteserver.herokuapp.com/api/auth/login",
      userCredential
    );

    localStorage.setItem("user", JSON.stringify(res.data));
    const remainingMilliseconds = 60 * 60 * 1000;
    const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
    localStorage.setItem("expiryDate", expiryDate.toISOString());

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    // localStorage.setItem("user", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOGIN_FAILURE", payload: error });
    throw new Error("Not found");
  }
};

export const logout = async (dispatch) => {
  localStorage.removeItem("expiryDate");
  localStorage.removeItem("user");
  localStorage.removeItem("justOnce");
  dispatch({ type: "LOGOUT" });
};

export const sign = async (dispatch) => {
  dispatch({ type: "SIGN" });

  setTimeout(() => {
    dispatch({ type: "SUCCESS" });
  }, 5000);
};
