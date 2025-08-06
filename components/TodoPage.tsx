import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TodoItem } from './TodoItem';
import { Todo, User } from '../App';
import { Plus, Search } from 'lucide-react';

interface TodoPageProps {
  todos: Todo[];
  onAddTodo: (text: string, category: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  user: User | null;
}

export function TodoPage({ todos, onAddTodo, onToggleTodo, onDeleteTodo, user }: TodoPageProps) {
  const [newTodo, setNewTodo] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim(), newCategory);
      setNewTodo('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);
    return matchesSearch && matchesFilter;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-blue-100">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          {user && (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-400/30 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="capitalize flex-1"
            >
              {filterType}
            </Button>
          ))}
        </div>
      </div>

      {/* Add Todo */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex space-x-2 mb-2">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            className="flex-1"
          />
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Study">Study</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleAddTodo}
          className="w-full"
          disabled={!newTodo.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matching tasks' : 'No tasks yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search' : 'Add your first task to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onDelete={onDeleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}