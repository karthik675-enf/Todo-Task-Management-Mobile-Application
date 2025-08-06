import { Button } from './ui/button';
import { CheckSquare, BarChart3 } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: 'todos' | 'dashboard';
  onPageChange: (page: 'todos' | 'dashboard') => void;
}

export function BottomNavigation({ currentPage, onPageChange }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'todos' as const,
      label: 'Tasks',
      icon: CheckSquare,
    },
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: BarChart3,
    },
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
      <div className="flex space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(item.id)}
              className={`
                flex-1 flex flex-col items-center space-y-1 h-auto py-2
                ${isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}