import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Todo } from '../App';
import { Trash2, Clock } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200));
    onDelete(todo.id);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Work: 'bg-blue-100 text-blue-800 border-blue-200',
      Personal: 'bg-green-100 text-green-800 border-green-200',
      Health: 'bg-red-100 text-red-800 border-red-200',
      Study: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`
      bg-white rounded-lg border p-4 shadow-sm transition-all duration-200
      ${todo.completed ? 'bg-gray-50 border-gray-200' : 'border-gray-200 hover:shadow-md'}
      ${isDeleting ? 'scale-95 opacity-50' : ''}
    `}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`
            flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
            ${todo.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-blue-500'
            }
          `}
        >
          {todo.completed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className={`
              text-sm leading-relaxed transition-all duration-200
              ${todo.completed 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900'
              }
            `}>
              {todo.text}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-500 p-1 h-auto"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getCategoryColor(todo.category)}`}
            >
              {todo.category}
            </Badge>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatDate(todo.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}