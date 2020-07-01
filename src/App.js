///////// APP.JS  ////////////////////////////////////////////////////////
//
//import React from 'react';
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Logout from "./Logout";
import Clock from "./Clock";
import Task from "./Task";
import "./App.css";
import { db, auth } from "./firebase";

////////////////////////////////////////////////////////////////////////

// The App Compnent's main function.  Everything is in here.
function App() {
  // we need a list of tasks.
  // we want to use React hooks. like useState
  // writing 'const [tasks, setTasks]' is a convention / conventional way of writing a React hook.

  // set up tasks array.  map will not work unless it is an array []. (ended up not using map)
  const [tasks, setTasks] = useState([]);

  // write a state (short term memory. array) hook
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");

  ////////////////////////////////////////////////////////////////////////
  // Setup a listener.
  // Start listening for authentication changes.
  useEffect(() => {
    // Test - useEffect is designed to run once on mount.
    // console.log(
    //   "useEffect 1: I ran when the component loaded! and when user authentication changes."
    // );
    ////
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        // set user's state
        setUser(user);
        //setUserEmail(user.email);
        // Troubleshooting
        // console.log(
        //   "In useEffenct 1: onAuthStateChanged: user not null and setUser called: ",
        //   user["email"]
        // );
        //console.log(user.email);
      } else {
        // No user is signed in.
        // Set the user state to null.
        setUser(null);
      }
    });
    //////////
  }, []); // run once when component loads.

  // Setup a listener.
  // Start listening for task table changes.
  useEffect(() => {
    // Test - useEffect is designed to run once on mount.
    // console.log(
    //   "useEffect 2: I ran when the component loaded! and when the task table changes, and when user changes."
    // );
    ///////////////////////////////////////////////////
    // for collections with multiple fields, you have to create an object array.
    const retrievedTasks = [];
    // The thing that makes everything work:)
    // To get multi users to work, had to move this into useEffect.
    // onSnapShot is a listener. It says: get a live snapshot of whatever is in the collection
    // and when it changes, refire.
    if (user) {
      db.collection("tasks")
        .where("userName", "==", user["email"])
        .orderBy("dateTime", "desc")
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
    }
    //////////
  }, [user]); // run once when component loads, and when user changes!!

  //////////////////////////////////////////////////////////////////////////////////
  // login function.
  const login = (e) => {
    //keep page from refreshing on submit.
    e.preventDefault();

    // Troubleshooting
    //console.log("the default details are");
    //console.log(username);
    //console.log(password);
    //console.log("logging in...");

    // A promise. Is when a function call goes out and then brings back info.
    // Go and try and login with that email and pw, 'then' comeback, and 'catch' any errors.
    auth
      .signInWithEmailAndPassword(username, password)
      .then((response) => {
        // set user's state
        setUser(response.user);

        // Troubleshooting
        //console.log("logged in successful:here's the email: ");
        //console.log(response.user.email);
      })
      .catch((error) => {
        // Troubleshooting
        //console.log("error logging in: ");
        //console.log(error);
        setError(error.message);
        //
      });
  };

  // logout function.
  const logout = (e) => {
    //keep page from refreshing on submit.
    e.preventDefault();

    setTasks([]);
    setUsername("");
    setPassword("");
    setError("");
    setUser(null);

    auth
      .signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened
        console.log(error);
      });
    ////
  };

  // createAccount function.
  const createAccount = (e) => {
    //keep page from refreshing on submit.
    e.preventDefault();

    // Testing...
    //console.log("resgistering...");

    auth
      .createUserWithEmailAndPassword(username, password)
      // .then((response) => {
      //   console.log("the new user is: ", response);
      // })
      .catch((error) => {
        // Troubleshooting
        //console.log("error creating user: ");
        //console.log(error);
        //
        setError(error.message);
        //
      });
    ////
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

    const newTask = {
      AKey: sAKey,
      userName: user["email"],
      title: input,
      dateTime: currentTime,
      completed: false,
      textDec: "none",
    };

    // insert / add to database collection.
    db.collection("tasks").add({
      AKey: sAKey,
      userName: user["email"],
      title: input,
      dateTime: currentTime,
      completed: false,
      textDec: "none",
    });

    // Add new task to the useState tasks.
    setTasks([newTask, ...tasks]); // puts the next task on the top.

    // clear the input field
    setInput("");
    ////
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
    // console.log("This is the doc.id value: ", id);

    // Find the index of an object in an array!
    index = tasks.findIndex((x) => x.id === id);

    // Troubleshoot
    // console.log("This is the index for splice value: " + index);

    // removes 1 item form the tasks array at the index location.
    tasks.splice(index, 1);

    setTasks([...tasks]);

    // new for more complex multi user app
    //popTasks();

    // your can ONLY delete from the collection...
    // by using the 'Add Document' id or doc.id value!!
    db.collection("tasks").doc(id).delete();
    //
  };

  // handleComplete function. to handle check box click. e for event.
  const handleComplete = (e) => {
    // we do this to prevent the whole page from refreshing!
    //...but to get the check box to respond, to work, I had to comment this out!!?
    //e.preventDefault();

    //
    let id = e.target.value;
    //
    let index = -1;
    //
    let updateTextDec = "";

    // Copy the old array to a new value...
    // ...because we NEVER directly modify the state.
    let updatedTasks = [...tasks];

    // Set textDec
    if (e.target.checked) {
      updateTextDec = "line-through";
    } else {
      updateTextDec = "none";
    }

    // Troubleshooting
    // console.log("In markComplete: e.target.value ", e.target.value);
    // console.log("In markComplete: e.target.checked ", e.target.checked);

    // Find the index of an object in an array!
    index = updatedTasks.findIndex((x) => x.id === id);

    // Create a copy of the object and then rewrite / change the values
    // for the key value pair using index.
    updatedTasks[index] = {
      ...updatedTasks[index],
      completed: e.target.checked,
      textDec: updateTextDec,
    };

    // set temp memory useState
    setTasks([...updatedTasks]);
    //

    // firebase database update.
    db.collection("tasks").doc(id).update({
      completed: e.target.checked,
      textDec: updateTextDec,
    });
    /////
  };

  // Return: This is HTML to be displayed that the main function will return.
  // REACT allows javascript to update parts of this without refreshing the whole page.
  // Anywhere before the return we can write javascript. After this is jsx.
  return (
    <div className="app">
      <div className="container-1">
        {!user ? (
          <Login
            appUser={user}
            appUserName={username}
            setAppUserName={setUsername}
            appUserPw={password}
            loginUser={login}
            createUserAccount={createAccount}
            appSetPassword={setPassword}
            appSetError={setError}
            appError={error}
            userAuth={auth}
          />
        ) : (
          <div>
            <Logout appUserName={user["email"]} logoutUser={logout} />

            <form>
              <div className="app-title">Task List</div>

              <Clock />

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
                  <button
                    type="submit"
                    disabled={!input}
                    value={username}
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>

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
        )}
      </div>
    </div>
  );
}

export default App;
