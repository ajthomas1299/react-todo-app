//import React from 'react';
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Logout from "./Logout";
import Input from "./Input";
import Task from "./Task";
import "./App.css";
import { db, auth } from "./firebase";

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

  // when component loads, run this...
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      // set user's state
      setUser(user);
    } else {
      // No user is signed in.
      // Set the user state to null.
      setUser(null);
    }
  });

  // login function.
  const login = (e) => {
    //keep page from refreshing on submit.
    e.preventDefault();

    // console.log("the default details are");
    // console.log(username);
    // console.log(password);
    // console.log("logging in...");

    // A promise. Is when a function call goes out and then brings back info.
    // Go and try and login with that email and pw, 'then' comeback, and 'catch' any errors.
    auth
      .signInWithEmailAndPassword(username, password)
      // .then((response) => {
      //   // set user's state
      //   setUser(response.user);

      //   console.log("logged in successful: ");
      //   console.log(response);
      // })
      .catch((error) => {
        console.log("error logging in: ");
        console.log(error);
        setError(error.message);
      });
  };

  // logout function.
  const logout = (e) => {
    //keep page from refreshing on submit.
    e.preventDefault();

    auth.signOut();

    setUsername(null);
    setPassword(null);
    setError(null);
    setUser(null);
  };

  // createAccount function.
  const createAccount = (e) => {
    //keep page from refreshing on submit.
    e.preventDefault();

    console.log("resgistering...");

    auth
      .createUserWithEmailAndPassword(username, password)
      // .then((response) => {
      //   console.log("the new user is: ", response);
      // })
      .catch((error) => {
        console.log("error creating user: ");
        console.log(error);
        setError(error.message);
      });
  };

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
    });
  }, []); // <= run once on mount

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
            <Logout logoutUser={logout} />

            <Input />

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
