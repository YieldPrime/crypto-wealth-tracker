import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Target, 
  Calculator, 
  Gift, 
  PenTool, 
  Bell,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  Cloud,
  CloudOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'chapters', label: 'Chapters', icon: BookOpen },
  { id: 'tools', label: 'Tools', icon: Calculator },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'dreams', label: 'Dreams', icon: Gift },
  { id: 'journal', label: 'Journal', icon: PenTool },
  { id: 'reminders', label: 'Reminders', icon: Bell },
];

export default function Navbar({ currentPage, setCurrentPage, onAuthClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state, handleLogout } = useApp();
  
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[#1f1f2e]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentPage('dashboard')}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-2xl">💎</span>
              <span 
                className="text-xl font-bold bg-gradient-to-r from-[#39ff14] to-[#bf00ff] bg-clip-text text-transparent"
                style={{ fontFamily: 'Orbitron' }}
              >
                GG Mindset
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-link flex items-center gap-2 py-2 text-sm font-medium transition-colors ${
                    currentPage === item.id ? 'active text-[#39ff14]' : ''
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              {state.isLoggedIn ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
                    <Cloud size={14} className="text-[#39ff14]" />
                    <span className="text-sm text-gray-400">Synced</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage('profile')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#39ff14]/50 transition-colors"
                  >
                    <span className="text-lg">{state.profile.avatar || '🦊'}</span>
                    <span className="text-sm text-white">
                      {state.profile.displayName || state.user?.displayName || 'Profile'}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="hidden md:flex items-center gap-2 btn-primary text-sm py-2 px-4"
                >
                  <LogIn size={16} />
                  Login / Sign Up
                </button>
              )}
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a24] border border-[#2a2a3a]">
                <span className="text-lg">🔥</span>
                <span className="font-bold text-[#ff6b35]">{state.streak}</span>
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 glass-card border-b border-[#1f1f2e] md:hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id 
                      ? 'bg-[#39ff14]/10 text-[#39ff14]' 
                      : 'text-gray-400 hover:bg-[#1a1a24]'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-[#2a2a3a]">
                {state.isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setCurrentPage('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#1a1a24]"
                    >
                      <span className="text-xl">{state.profile.avatar || '🦊'}</span>
                      <span>Profile</span>
                      <Cloud size={16} className="ml-auto text-[#39ff14]" />
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-[#1a1a24]"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onAuthClick();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 btn-primary"
                    >
                      <LogIn size={18} />
                      Login / Sign Up
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Sign up to save progress to cloud
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
