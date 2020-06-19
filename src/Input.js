import React, { useState } from "react";
import { db } from "./firebase";
import Clock from "./Clock";
//import "./Input.css";

// The Input Compnent's main function.  Everything is in here.
const Input = () => {
  // Troubleshooting
  //console.log(props);

  // make some short term memory / setup the state
  const [input, setInput] = useState("");

  // handleSubmit function. Add task function to handle button click. e for event.
  const handleSubmit = (e) => {
    // we do this to prevent the whole page from refreshing!
    e.preventDefault();

    // get a dateTime for the collection. So we can sort etc.
    var currentTime = getDateTime();

    // get new unique (hopefull) id from the Firebase collection
    var sAKey = newID();

    // ... = spread operator ES6. Whatever is inside the array spread it out.
    // spread whatever is inside of the array, seperate them add the input and
    // put them inside the new tasks array.

    //setTasks([...tasks, input]);  // puts the next task on the bottom.
    //setTasks([ input, ...tasks]); // puts the next task on the top.

    // database version of the above.
    db.collection("tasks").add({
      AKey: sAKey,
      title: input,
      dateTime: currentTime,
      completed: false,
      textDec: "none",
    });

    // clear the input field
    setInput("");
  };

  // getDateTime function. This function returns the current timestamp.
  function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length === 1) {
      month = "0" + month;
    }
    if (day.toString().length === 1) {
      day = "0" + day;
    }
    if (hour.toString().length === 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length === 1) {
      minute = "0" + minute;
    }
    if (second.toString().length === 1) {
      second = "0" + second;
    }

    var dateTime =
      year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;

    return dateTime;
  }

  // newID function. An attempt to get a unique ID for adding rows to the database.
  const newID = () => {
    //
    var myRef = db.collection("tasks").doc();
    var newUniqueID = myRef.id;

    return newUniqueID;
  };

  /////////////////////////////
  return (
    <form>
      <div className="app-title">Task List</div>

      <div className="add-task">
        <div className="input-field">
          <input
            placeholder="Enter Task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
          />
        </div>

        <div className="add-task-button">
          <button disabled={!input} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>

      <Clock />

      <hr></hr>
    </form>
  );
};

export default Input;
