import {createContext, useEffect, useReducer } from "react";

const initialState = {
  user: localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token"),
  activationToken: localStorage.getItem("activationToken"),
  activationCode: localStorage.getItem("activationCode")
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "ACTIVATE_USER":
        return {
            activationToken: action.payload.activationToken,
            activationCode: action.payload.activationCode,
            user: null,
            token: null
        }

    case "VERIFY_OTP":
        return {
            activationToken: null,
            activationCode: null,
        }
        
    case "LOGIN_START":
      return {
        user: null,
        token: null,
      };

    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        activationToken: null,
        activationCode: null,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        activationToken: null,
        activationCode: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user))
    localStorage.setItem("token", state.token);
    localStorage.setItem("activationToken", state.activationToken);
    localStorage.setItem("activationCode", state.activationCode);
  }, [state])

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        activationToken: state.activationToken,
        activationCode: state.activationCode,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
