import React from "react";
//import { auth } from "./firebase";
import "./Login.css";

// The Login Compnent's main function.  Everything is in here.
const Login = (props) => {
  // Troubleshooting
  //console.log(props);

  /////////////////////////////
  return (
    <header className="App-header">
      <h1>Task App Login</h1>
      {props.appUser ? <p>Logged In</p> : <p>You are logged out</p>}
      {!props.appUser ? (
        <form className="login-form">
          <div className="login-group">
            <input
              className="username-field"
              value={props.appUserName}
              onChange={(e) => props.setAppUserName(e.target.value)}
              type="text"
              placeholder="Enter Username"
            />
            <input
              className="password-field"
              value={props.appUserPw}
              onChange={(e) => props.appSetPassword(e.target.value)}
              type="password"
              placeholder="Enter Password"
            />

            <button
              className="login-button"
              type="submit"
              onClick={props.loginUser}
            >
              Login
            </button>
          </div>
          <div className="help-buttons">
            <button className="create-button" onClick={props.createUserAccount}>
              Create an Account
            </button>
            <button
              className="forgot-button"
              onClick={(e) =>
                props.userAuth
                  .sendPasswordResetEmail(props.appUserName)
                  .catch((error) => props.appSetError(error.message))
              }
            >
              Forgot Password?
            </button>
          </div>
          {props.appError && <p>{props.appError}</p>}
        </form>
      ) : (
        <button onClick={(e) => props.userAuth.signOut()}>Logout</button>
      )}
    </header>
  );
};

export default Login;
