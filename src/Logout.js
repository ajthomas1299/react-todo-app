import React from "react";
import "./Logout.css";

// The Login Compnent's main function.  Everything is in here.
const Logout = (props) => {
  // Troubleshooting
  //console.log(props);

  /////////////////////////////
  return (
    <div className="logout-div">
      <button className="logout-button" onClick={props.logoutUser}>
        Logout
      </button>
      <p className="user-email">{props.appUserName}</p>
      <button className="refresh-button" onClick={props.refreshPage}>
        Refresh
      </button>
    </div>
  );
};

export default Logout;
