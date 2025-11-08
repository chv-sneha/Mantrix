import { Home, BookOpen, Trophy, User } from "lucide-react";
import { useLearning } from "@/lib/stores/useLearning";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { userProgress } = useLearning();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b-4 border-indigo-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center glow">
              <span className="text-2xl">🎮</span>
            </div>
            <h1 className="font-game text-lg sm:text-xl text-indigo-400 glow-text">
              SkillQuest
            </h1>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg
                    transition-all duration-300 font-orbitron text-xs sm:text-sm font-semibold
                    ${isActive 
                      ? 'bg-indigo-600 text-white glow scale-105' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-indigo-400'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg border-2 border-purple-500">
              <span className="font-retro text-2xl text-yellow-400">⭐</span>
              <div className="flex flex-col">
                <span className="font-orbitron text-xs text-gray-400">Level</span>
                <span className="font-game text-sm text-purple-400">{userProgress.level}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-800 px-3 sm:px-4 py-2 rounded-lg border-2 border-indigo-500">
              <span className="font-retro text-xl sm:text-2xl">💎</span>
              <div className="flex flex-col">
                <span className="font-orbitron text-xs text-gray-400 hidden sm:block">XP</span>
                <span className="font-game text-xs sm:text-sm text-indigo-400">{userProgress.totalXP}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
