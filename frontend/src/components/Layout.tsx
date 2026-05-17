import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-colors duration-200">
        <div>
          {/* Logo / Brand Area */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
                G
              </div>
              <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-white">GigFlow</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm transition-all">
              <LayoutDashboard size={18} />
              Leads Dashboard
            </button>
          </nav>
        </div>

        {/* User Footer Profile Panel */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm transition-all"
          >
            <span className="flex items-center gap-3">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
              <UserIcon size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto p-8 text-slate-900 dark:text-white">
        <Outlet />
      </main>
    </div>
  );
};