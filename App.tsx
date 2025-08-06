import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { TodoPage } from './components/TodoPage';
import { DashboardPage } from './components/DashboardPage';
import { BottomNavigation } from './components/BottomNavigation';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'todos' | 'dashboard'>('todos');
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      text: 'Complete project presentation',
      completed: false,
      createdAt: new Date('2025-01-06'),
      category: 'Work'
    },
    {
      id: '2', 
      text: 'Buy groceries for dinner',
      completed: true,
      createdAt: new Date('2025-01-05'),
      category: 'Personal'
    },
    {
      id: '3',
      text: 'Schedule dentist appointment',
      completed: false,
      createdAt: new Date('2025-01-04'),
      category: 'Health'
    }
  ]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('todos');
  };

  const addTodo = (text: string, category: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      category
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-background flex flex-col max-w-md mx-auto border-x">
      <main className="flex-1 overflow-hidden">
        {currentPage === 'todos' ? (
          <TodoPage 
            todos={todos}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            user={user}
          />
        ) : (
          <DashboardPage 
            todos={todos}
            user={user}
            onLogout={handleLogout}
          />
        )}
      </main>
      
      <BottomNavigation 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}