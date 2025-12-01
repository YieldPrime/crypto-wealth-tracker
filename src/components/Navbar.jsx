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
  Wallet,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';

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
  const { state, handleLogout, connectWallet, disconnectWallet } = useApp();
  
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[#1f1f2e]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="cursor-pointer"
              onClick={() => setCurrentPage('dashboard')}
              whileHover={{ scale: 1.02 }}
            >
              <Logo size={36} showText={true} />
            </motion.div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
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
            
            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* XP Badge */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
                <Zap size={14} className="text-[#ffd700]" />
                <span className="text-sm font-bold text-[#ffd700]" style={{ fontFamily: 'Orbitron' }}>
                  {state.xp}
                </span>
              </div>
              
              {/* Streak */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
                <span className="text-sm">🔥</span>
                <span className="text-sm font-bold text-[#ff6b35]">{state.streak}</span>
              </div>
              
              {/* Wallet Connect */}
              {state.connectedWallet ? (
                <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
                  <Wallet size={14} className="text-[#bf00ff]" />
                  <span className="text-xs text-[#bf00ff] font-mono">
                    {formatAddress(state.connectedWallet)}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#bf00ff]/50 transition-colors text-xs text-gray-400 hover:text-[#bf00ff]"
                >
                  <Wallet size={14} />
                  <span className="hidden lg:inline">Connect</span>
                </button>
              )}
              
              {/* Auth */}
              {state.isLoggedIn ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/30">
                    <Cloud size={12} className="text-[#39ff14]" />
                    <span className="text-xs text-[#39ff14]">Synced</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage('profile')}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#39ff14]/50 transition-colors"
                  >
                    <span className="text-lg">{state.profile.avatar || '🦊'}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="hidden md:flex items-center gap-1 btn-primary text-xs py-1.5 px-3"
                >
                  <LogIn size={14} />
                  Login
                </button>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 glass-card border-b border-[#1f1f2e] lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
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
              
              {/* Mobile Wallet */}
              <div className="pt-4 border-t border-[#2a2a3a]">
                {state.connectedWallet ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#1a1a24]">
                    <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-[#bf00ff]" />
                      <span className="text-sm text-[#bf00ff] font-mono">
                        {formatAddress(state.connectedWallet)}
                      </span>
                    </div>
                    <button onClick={disconnectWallet} className="text-red-500 text-sm">
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1a1a24] text-gray-400"
                  >
                    <Wallet size={18} />
                    Connect Wallet
                  </button>
                )}
              </div>
              
              {/* Mobile Auth */}
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
