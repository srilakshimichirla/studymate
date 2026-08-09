import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FileQuestion, 
  StickyNote, 
  Clock, 
  Bookmark, 
  User, 
  Settings,
  Menu,
  X,
  LogOut,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/quiz', icon: FileQuestion, label: 'Quiz' },
    { path: '/notes', icon: StickyNote, label: 'My Notes' },
    { path: '/history', icon: Clock, label: 'History' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50 transition-transform duration-300 ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <span className="text-3xl">🤖</span>
              <span className="text-xl font-bold text-gray-800">AI StudyMate</span>
            </div>
            {isMobile && (
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-gray-50 transition"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Start Learning</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;