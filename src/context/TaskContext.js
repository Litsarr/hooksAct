import React, {
  createContext,
  useState,
  useReducer,
  useEffect,
  useMemo,
} from "react";

// Initial state for tasks and filter
const initialState = {
  tasks: localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [],
  filter: localStorage.getItem("filter") || "all", // Default filter
};

// Reducer function to manage state changes for tasks
function taskReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload], // Add new task to tasks array
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ), // Update existing task with new data
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload), // Remove task from tasks array
      };
    case "TOGGLE_COMPLETED":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed } // Toggle task completion status
            : task
        ),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload, // Update filter type (all, completed, incomplete)
      };
    default:
      return state;
  }
}

// Context creation for tasks management
const TaskContext = createContext({
  tasks: [],
  dispatch: () => {},
});

const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Effect hook to update local storage when tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const [filter, setFilter] = useState(state.filter); // State for filter selection

  // Memoized filtered tasks based on current filter state and tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "all":
        return state.tasks;
      case "completed":
        return state.tasks.filter((task) => task.completed); // Filter completed tasks
      case "incomplete":
        return state.tasks.filter((task) => !task.completed); // Filter incomplete tasks
      default:
        return state.tasks;
    }
  }, [state.tasks, filter]);

  // Function to add a new task
  const addTask = (newTask) => {
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  // Function to toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    dispatch({ type: "TOGGLE_COMPLETED", payload: taskId });
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    dispatch({ type: "DELETE_TASK", payload: taskId });
  };

  // Function to handle editing a task
  const handleEditTask = (taskId) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        id: taskId,
        isEditing: true,
      },
    });
  };

  // Function to save changes made to a task
  const handleSaveTask = (taskId, updatedText) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        id: taskId,
        text: updatedText,
        isEditing: false,
      },
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks, // Provide filtered tasks to consumers
        dispatch, // Provide dispatch function for state management
        addTask, // Function to add a new task
        toggleTaskCompletion, // Function to toggle task completion
        deleteTask, // Function to delete a task
        handleEditTask, // Function to handle task editing
        handleSaveTask, // Function to save edited task
        filter, // Current filter type
        setFilter, // Function to update filter type
      }}
    >
      {children} {/* Render children components */}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider }; // Export TaskContext and TaskProvider components
