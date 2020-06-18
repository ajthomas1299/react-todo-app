//import React from 'react';
import React, { useState, useEffect } from "react";
import Task from "./Task";
import Clock from "./Clock"; //This is causing a warning but it is needed for the clock to work.
import "./App.css";
import db from "./firebase";

// The App Compnent's main function.  Everything is in here.
function App() {
  // we need a list of tasks.
  // we want to use React hooks. like useState
  // writing 'const [tasks, setTasks]' is a convention / conventional way of writing a React hook.

  // set up tasks array.  map will not work unless it is an array []. (ended up not using map)
  const [tasks, setTasks] = useState([]);

  // make some short term memory / setup the state
  const [input, setInput] = useState("");

  // map our database content to our tasks state / short term memory.
  useEffect(() => {
    // Test - useEffect is designed to run once on mount.
    //console.log('I ran when the component loaded!');

    // the thing that makes everything work:)
    // onSnapShot is a listener. It says: get a live snapshot of whatever is in the collection
    // and when it changes, refire.
    db.collection("tasks").onSnapshot((snapshot) => {
      // use map for collections with one field.
      //setTasks(snapshot.docs.map((doc) => doc.data().title));

      // for collections with multiple fields, you have to create an object array.
      const retrievedTasks = [];

      // Create the object array.
      db.collection("tasks")
        .orderBy("dateTime")
        .get()
        .then(function (querySnapshot) {
          //
          querySnapshot.forEach(function (doc) {
            // Troubleshooting
            //console.log(doc.id, " => ", doc.data());
            //console.log(doc.id, " => ", doc.data().title);

            retrievedTasks.push({ ...doc.data(), id: doc.id });
          });

          setTasks(retrievedTasks);
        });
    });
  }, []); // <= run once on mount

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

  // handleDelete function. to handle delete button click. e for event.
  const handleDelete = (e) => {
    // we do this to prevent the whole page from refreshing!
    e.preventDefault();

    // e.target.value = e is the event, which in this case is delete button click,
    // target is the element that triggered the event, which in this case is the button,
    // and value is the value of the task element.
    let id = e.target.value;
    //
    let index = -1;

    // Troubleshoot
    //console.log( "This is the doc.id value: " + id );

    // Troublehshooting
    //console.log( tasks );

    // Find the index of an object in an array!
    index = tasks.findIndex((x) => x.AKey === id);

    // Troubleshoot
    //console.log( "This is the index for splice value: " + index );

    // removes 1 item form the tasks array at the index location.
    tasks.splice(index, 1);

    setTasks([...tasks]);

    // your can ONLY delete from the collection...
    // by using the 'Add Document' id or doc.id value!!
    db.collection("tasks").doc(id).delete();
  };

  // handleComplete function. to handle delete button click. e for event.
  const handleComplete = (e) => {
    // we do this to prevent the whole page from refreshing!
    e.preventDefault();

    let id = e.target.value;

    //
    console.log("In markComplete: " + e.target.checked);

    //props.completed === true ;

    // firebase database update.
    db.collection("tasks").doc(id).update({
      completed: e.target.checked,
      textDec: "line-through",
    });
  };

  // Return: This is HTML to be displayed that the main function will return.
  // REACT allows javascript to update parts of this without refreshing the whole page.
  // Anywhere before the return we can write javascript.
  return (
    <div className="app">
      <div className="container-1">
        <div className="app-title">Task List</div>

        <form>
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

        <div>
          {tasks.map((task, i) => (
            <Task
              title={task.title}
              completed={task.completed}
              key={i}
              index={task.id}
              deleteTask={handleDelete}
              markComplete={handleComplete}
              titleStyle={task.textDec}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
