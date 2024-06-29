import React, { useContext, useState, useRef } from "react";
import { TaskContext } from "../context/TaskContext"; // Import TaskContext

const TaskManager = () => {
  const {
    tasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    handleEditTask,
    handleSaveTask,
    filter,
    setFilter,
  } = useContext(TaskContext);

  const [newTaskText, setNewTaskText] = useState(""); // State for new task text
  const inputRef = useRef(null); // useRef to hold reference to input field

  const handleInputChange = (event) => {
    setNewTaskText(event.target.value); // Update state on input change
  };

  const handleAddTask = () => {
    if (newTaskText.trim() === "") return; // Prevent adding empty tasks

    addTask(newTaskText); // Add task using context
    setNewTaskText(""); // Clear state after adding
    inputRef.current.focus(); // Focus the input field after adding task
  };

  return (
    <div>
      <h2>Task Manager</h2>
      {/* Filter selection interface (choose buttons or dropdown) */}
      <div>
        <button onClick={() => setFilter("all")}>All Tasks</button>
        <button onClick={() => setFilter("completed")}>Completed Tasks</button>
        <button onClick={() => setFilter("incomplete")}>
          Incomplete Tasks
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Enter task..."
          onChange={handleInputChange}
          value={newTaskText} // Set input value from state
          ref={inputRef} // Assign the ref to the input element
        />
        <button onClick={handleAddTask}>Add Task</button>{" "}
        {/* Separate button for adding */}
      </div>

      {tasks !== null && (
        <ul>
          {/* Display filtered tasks */}
          {tasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed} // Set checkbox state based on task.completed
                onChange={() => toggleTaskCompletion(task.id)} // Function provided by TaskContext
              />
              {task.isEditing ? ( // Check if task is in editing mode
                <input
                  type="text"
                  defaultValue={task.text} // Pre-populate edited text
                  onBlur={(e) => handleSaveTask(task.id, e.target.value)} // Function provided by TaskContext
                />
              ) : (
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "",
                  }}
                >
                  {task.text}
                </span>
              )}
              <button onClick={() => handleEditTask(task.id)}>
                {task.isEditing ? "Save" : "Edit"}
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskManager; // Export the component
