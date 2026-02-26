import { useState, useEffect } from 'react';
import { userState } from '../store/user-state';

export const TodoList = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo } = userState();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      await addTodo(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };

  const handleToggle = async (id: string) => {
    await toggleTodo(id);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  return (
    <div className="h-full flex flex-col bg-surface p-4">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Todos</h2>

      <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-text-inverse rounded-lg hover:opacity-90 transition-opacity"
        >
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto">
        {todos.length === 0 ? (
          <p className="text-text-secondary text-center py-8">
            No todos yet. Add your first todo above!
          </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                  className="w-5 h-5 text-primary focus:ring-primary rounded"
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? 'line-through text-text-secondary' : 'text-text-primary'
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
