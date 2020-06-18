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
  };

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

        <div className="deleteButton-parent">
          <button
            className="deleteButton"
            value={props.index}
            onClick={props.deleteTask}
          >
            Delete
          </button>
        </div>
      </div>
    </form>
  );
};

export default Task;
