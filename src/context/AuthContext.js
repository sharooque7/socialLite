import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const user = JSON.parse(localStorage.getItem("user"))
  ? JSON.parse(localStorage.getItem("user"))["user"]
  : null;
const INITIAL_STATE = {
  user: user,
  isFetching: false,
  error: false,
  sign: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        user: state.user ? state.user : null,
        isFetching: state.isFetching,
        error: state.error,
        sign: state.sign,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
