import { useReducer, useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, CheckCircle, X } from "lucide-react";
import axios from "axios";


interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

type Action =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: string }
  | {
      type: "EDIT_TASK";
      payload: { id: string; title: string; description: string };
    }
  | { type: "REORDER_TASKS"; payload: Task[] };

const taskReducer = (state: Task[], action: Action): Task[] => {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, action.payload];
    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.payload);
    case "TOGGLE_TASK":
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
    case "EDIT_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              title: action.payload.title,
              description: action.payload.description,
            }
          : task
      );
    case "REORDER_TASKS":
      return action.payload;
    default:
      return state;
  }
};

function App() {
  const [tasks, dispatch] = useReducer(taskReducer, [], () => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = localStorage.getItem("tasks");
        if (!storedTasks || JSON.parse(storedTasks).length === 0) {
          const res = await axios.get(import.meta.env.VITE_BACKEND_URI);
          const data = res.data;
          const trimmedData = data.slice(0, 10).map((task: any) => ({
            id: task.id,
            title: task.title,
            description: "",
            completed: task.completed,
          }));
          localStorage.setItem("tasks", JSON.stringify(trimmedData));
          dispatch({ type: "REORDER_TASKS", payload: trimmedData });
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
  
    fetchTasks();
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      if (editingTask) {
        dispatch({
          type: "EDIT_TASK",
          payload: {
            id: editingTask.id,
            title: newTask.title,
            description: newTask.description,
          },
        });
      } else {
        dispatch({
          type: "ADD_TASK",
          payload: {
            id: Date.now().toString(),
            title: newTask.title.trim(),
            description: newTask.description.trim(),
            completed: false,
          },
        });
      }
      setNewTask({ title: "", description: "" });
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description });
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <h1 className="text-4xl text-center p-4 font-extrabold text-blue-500">
        Manage tasks easily
      </h1>
      {/* Search Bar */}
      <div className="max-w-6xl mx-auto mb-8 pt-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg shadow-md p-4 ${
              task.completed ? "bg-green-50 border-2 border-green-200" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3
                className={`text-lg font-semibold ${
                  task.completed ? "text-green-700" : "text-gray-800"
                }`}
              >
                {task.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_TASK",
                      payload: task.id,
                    })
                  }
                  className={`p-1 rounded-full ${
                    task.completed
                      ? "text-green-600"
                      : "text-gray-400 hover:text-green-600"
                  }`}
                >
                  <CheckCircle size={20} />
                </button>
                <button
                  onClick={() => startEditing(task)}
                  className="p-1 rounded-full text-blue-600 hover:text-blue-700"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() =>
                    dispatch({
                      type: "DELETE_TASK",
                      payload: task.id,
                    })
                  }
                  className="p-1 rounded-full text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <p
              className={`text-sm ${
                task.completed ? "text-green-600" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditingTask(null);
          setNewTask({ title: "", description: "" });
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-colors"
      >
        <Plus size={24} />
      </button>

      {/* Add/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Task title"
              className="w-full px-4 py-2 mb-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Task description"
              className="w-full px-4 py-2 mb-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingTask ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          {searchTerm
            ? "No tasks found"
            : "No tasks yet. Click the + button to add one!"}
        </div>
      )}
    </div>
  );
}

export default App;
