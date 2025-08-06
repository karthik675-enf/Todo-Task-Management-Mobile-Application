import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Todo, User } from '../App';
import { TrendingUp, Calendar, Target, Award, LogOut, CheckCircle2, Clock, BarChart3 } from 'lucide-react';

interface DashboardPageProps {
  todos: Todo[];
  user: User | null;
  onLogout: () => void;
}

export function DashboardPage({ todos, user, onLogout }: DashboardPageProps) {
  const completedTodos = todos.filter(todo => todo.completed);
  const completionRate = todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0;
  const todaysTodos = todos.filter(todo => {
    const today = new Date();
    const todoDate = todo.createdAt;
    return todoDate.toDateString() === today.toDateString();
  });

  const categoryStats = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentActivity = todos
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const getMotivationalMessage = () => {
    if (completionRate >= 80) return "🎉 Amazing! You're crushing your goals!";
    if (completionRate >= 60) return "💪 Great progress! Keep it up!";
    if (completionRate >= 40) return "📈 You're on the right track!";
    return "🚀 Every journey starts with a single step!";
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {user && (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
              />
            )}
            <div>
              <h1 className="text-xl font-bold">Welcome back!</h1>
              <p className="text-purple-100">{user?.name}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-sm text-purple-100 mb-1">Today's Progress</p>
          <p className="text-lg font-semibold">{getMotivationalMessage()}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{completedTodos.length}</p>
              <p className="text-xs text-gray-600">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{todos.length - completedTodos.length}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <BarChart3 className="w-4 h-4" />
              <span>Completion Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-semibold">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Target className="w-4 h-4" />
              <span>Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm">{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Calendar className="w-4 h-4" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((todo, index) => (
                  <div key={todo.id} className="flex items-center space-x-3">
                    <div className={`
                      w-2 h-2 rounded-full
                      ${todo.completed ? 'bg-green-500' : 'bg-yellow-500'}
                    `}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{todo.text}</p>
                      <p className="text-xs text-gray-500">
                        {todo.createdAt.toLocaleDateString()} • {todo.category}
                      </p>
                    </div>
                    {todo.completed && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievement */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">Keep Going!</h3>
                <p className="text-sm text-gray-600">
                  {completionRate >= 50 
                    ? "You're doing great! Keep up the momentum!" 
                    : "Complete more tasks to unlock achievements!"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivation Image */}
        <div className="relative rounded-xl overflow-hidden">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=150&fit=crop"
            alt="Motivation"
            className="w-full h-24 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
            <p className="text-white font-semibold ml-4">
              "Success is the sum of small efforts repeated day in and day out."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}