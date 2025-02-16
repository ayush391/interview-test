import { useState } from "react";
import "./index.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <li className={todo.completed ? "completed" : ""}>
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
    />
    <span>{todo.text}</span>
    <button onClick={() => onDelete(todo.id)}>Delete</button>
  </li>
);

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  // Bug 1: Reference equality issue causing duplicate todos
  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputText,
        completed: false,
      };
      // Bug: Using spread operator incorrectly
      setTodos((prevTodos) => [
        ...prevTodos,
        prevTodos[prevTodos.length - 1] || newTodo,
      ]);
      setInputText("");
    }
  };

  // Bug 2: Incorrect count calculation
  const incompleteTodosCount = todos.filter((todo) => todo.completed).length;

  // Bug 3: State update issue in markAllComplete
  const markAllComplete = () => {
    const updatedTodos = todos;
    updatedTodos.forEach((todo) => {
      todo.completed = true;
    });
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="App">
      <header>
        <h1>Todo List</h1>
        <p>Remaining todos: {incompleteTodosCount}</p>
      </header>

      <div className="add-todo">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <button onClick={markAllComplete}>Mark All Complete</button>

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
