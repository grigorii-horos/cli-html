# Building a Todo App with React: Complete Tutorial

Learn to build a fully functional todo application from scratch.

---

## Introduction

In this tutorial, we'll build a todo application with the following features:

- [x] Add new todos
- [x] Mark todos as complete
- [x] Delete todos
- [x] Filter todos (all, active, completed)
- [x] Persist data to localStorage

> [!NOTE]
> This tutorial assumes you have Node.js and npm installed.

## Prerequisites

Before starting, make sure you have:

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 18+ | https://nodejs.org |
| npm | 8+ | Included with Node.js |
| Code Editor | Any | VS Code recommended |

## Step 1: Project Setup

### Create New Project

```bash
npm create vite@latest todo-app -- --template react-ts
cd todo-app
npm install
```

### Project Structure

After setup, your project should look like this:

```
todo-app/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

> [!TIP]
> Use Vite for faster development experience compared to Create React App.

## Step 2: Define Types

Create `src/types.ts`:

```typescript
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';
```

**Why TypeScript?**
- ✓ Catch errors early
- ✓ Better IDE support
- ✓ Self-documenting code
- ✓ Easier refactoring

## Step 3: Create Todo Component

Create `src/components/TodoItem.tsx`:

```typescript
import { FC } from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};
```

### Key Concepts

**Props Interface**
:   Defines the shape of component props for type safety

**FC (FunctionComponent)**
:   TypeScript type for functional components

**Event Handlers**
:   Functions passed as props to handle user interactions

## Step 4: Create Todo List Component

Create `src/components/TodoList.tsx`:

```typescript
import { FC } from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList: FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return <p>No todos yet. Add one above!</p>;
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
```

> [!IMPORTANT]
> Always use unique keys when rendering lists to help React identify changed items.

## Step 5: Create Add Todo Form

Create `src/components/AddTodo.tsx`:

```typescript
import { FC, useState, FormEvent } from 'react';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export const AddTodo: FC<AddTodoProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
      />
      <button type="submit">Add</button>
    </form>
  );
};
```

### Form Handling Best Practices

- [x] Prevent default form submission
- [x] Validate input before processing
- [x] Clear input after submission
- [x] Trim whitespace from user input

## Step 6: Create Filter Component

Create `src/components/FilterBar.tsx`:

```typescript
import { FC } from 'react';
import { FilterType } from '../types';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
}

export const FilterBar: FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  activeCount
}) => {
  return (
    <div className="filter-bar">
      <span>{activeCount} items left</span>
      <div className="filters">
        <button
          className={currentFilter === 'all' ? 'active' : ''}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          className={currentFilter === 'active' ? 'active' : ''}
          onClick={() => onFilterChange('active')}
        >
          Active
        </button>
        <button
          className={currentFilter === 'completed' ? 'active' : ''}
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </button>
      </div>
    </div>
  );
};
```

## Step 7: Implement Main App Logic

Update `src/App.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { Todo, FilterType } from './types';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { FilterBar } from './components/FilterBar';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date()
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="app">
      <h1>Todo App</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
      <FilterBar
        currentFilter={filter}
        onFilterChange={setFilter}
        activeCount={activeCount}
      />
    </div>
  );
}

export default App;
```

### State Management Explained

**useState**
:   React hook for adding state to functional components

**useEffect**
:   React hook for side effects like data fetching or localStorage

**Derived State**
:   Values computed from existing state (like filteredTodos)

## Step 8: Add Styling

Create `src/App.css`:

```css
.app {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.todo-item span {
  flex: 1;
}

.todo-item span.completed {
  text-decoration: line-through;
  color: #999;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.filters {
  display: flex;
  gap: 8px;
}

.filters button {
  background: transparent;
  color: #666;
  padding: 8px 16px;
}

.filters button.active {
  background: #007bff;
  color: white;
}
```

## Step 9: Testing

### Manual Testing Checklist

- [ ] Add a new todo
- [ ] Mark todo as complete
- [ ] Unmark completed todo
- [ ] Delete a todo
- [ ] Filter todos (all/active/completed)
- [ ] Refresh page (data persists)
- [ ] Add empty todo (should not work)
- [ ] Add todo with whitespace only (should not work)

> [!WARNING]
> Always test edge cases like empty inputs and rapid clicking.

## Step 10: Run the Application

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Improvements and Next Steps

### Enhancements to Consider

1. **Edit Todos**
   - Add inline editing capability
   - Double-click to edit

2. **Categories/Tags**
   - Group todos by category
   - Add color-coded tags

3. **Due Dates**
   - Add date picker
   - Sort by due date
   - Show overdue items

4. **Drag and Drop**
   - Reorder todos
   - Use libraries like react-beautiful-dnd

5. **Backend Integration**
   - Connect to REST API
   - Real-time sync with WebSockets
   - User authentication

### Testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Example test:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AddTodo } from './AddTodo';

test('adds a new todo', () => {
  const mockAdd = vi.fn();
  render(<AddTodo onAdd={mockAdd} />);

  const input = screen.getByPlaceholderText('What needs to be done?');
  const button = screen.getByText('Add');

  fireEvent.change(input, { target: { value: 'New todo' } });
  fireEvent.click(button);

  expect(mockAdd).toHaveBeenCalledWith('New todo');
});
```

## Conclusion

Congratulations! You've built a fully functional todo application with:

- ✓ TypeScript for type safety
- ✓ React hooks for state management
- ✓ LocalStorage for data persistence
- ✓ Filtering and sorting features
- ✓ Clean, maintainable code structure

> [!TIP]
> Challenge yourself by implementing the suggested enhancements!

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)

---

*Happy coding!*
