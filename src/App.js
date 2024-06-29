import React from "react";

import TaskManager from "./components/TaskManager"; // Adjust the path as per your actual file location
import { TaskProvider } from "./context/TaskContext";

const App = () => {
  return (
    <TaskProvider>
      <TaskManager />
    </TaskProvider>
  );
};

export default App;
