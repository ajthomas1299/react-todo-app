import React from "react";
import "./Task.css";

// The Task Compnent's main function.  Everything is in here.
const Task = (props) => {
  // Troubleshooting
  //console.log(props);

  //
  const getStyle = (props) => {
    //
    //console.log("In getStyle: " + props.completed);

    if (props.completed) {
      return {
        textDecoration: "line-through",
      };
    } else {
      return {
        textDecoration: "none",
      };
    }
    ////
  };

  // let count = 0;
  // let count2 = 0;
  // safariRenderHack function. An attempt to get the Task components check box to rerender when tapped on my iphone.
  // I tried it in the div, Next I am trying an updated key in the actual object, button tag, input tag.
  // const safariRenderHack = () => {

  //   let date = new Date();
  //   let numberedDate = date.getTime();
  //   let newKey = numberedDate;
  //   //
  //   // console.log(countInteger % 2);
  //   // console.log("In safariRenderHack returning newKey: " + newKey);

  //   return newKey;

  //   // if (countInteger % 2 === 0) {
  //   //   return {
  //   //     opacity: 1
  //   //   };
  //   // } else {
  //   //   return {
  //   //     opacity: 0.5
  //   //   };
  //   // };
  //   ////
  //   // this.forceUpdate();
  //   ////
  // };

  //
  // const toggleChecked = (completed) => {
  //   //
  //   //return completed;
  // }

  /////////////////////////////
  return (
    <form className="task-list-form">
      <div className="task">
        <div className="check-box-group">
          <div className="check-box-main">

            <input
              className="check-box"
              type="checkbox"
              value={props.index}
              checked={props.completed}
              onChange={props.markComplete}
            />

          </div>

          <div className="task-title" style={getStyle(props)}>
            <h3>{props.title}</h3>
          </div>
        </div>

        <div className="deleteButton-parent" >
          <button

            className="deleteButton"
            value={props.index}
            onClick={props.deleteTask}
          >
            Delete
          </button>
        </div>
      </div>
    </form >
  );
};

export default Task;
