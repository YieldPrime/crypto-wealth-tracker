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
  Wallet,
  LogOut,
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

export default function Navbar({ currentPage, setCurrentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state, dispatch, connectWallet } = useApp();
  
  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        await connectWallet(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet to sync progress across devices');
    }
  };
  
  const handleDisconnect = () => {
    dispatch({ type: 'DISCONNECT_WALLET' });
  };
  
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
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
              {state.walletAddress ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
                    {state.cloudSyncEnabled ? (
                      <Cloud size={14} className="text-[#39ff14]" />
                    ) : (
                      <CloudOff size={14} className="text-gray-500" />
                    )}
                    <span className="text-sm text-[#39ff14] font-mono">
                      {formatAddress(state.walletAddress)}
                    </span>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Disconnect"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  className="hidden md:flex items-center gap-2 btn-secondary text-sm py-2 px-4"
                >
                  <Wallet size={16} />
                  Connect & Sync
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
                {state.walletAddress ? (
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      {state.cloudSyncEnabled ? (
                        <Cloud size={16} className="text-[#39ff14]" />
                      ) : (
                        <CloudOff size={16} className="text-gray-500" />
                      )}
                      <span className="text-sm text-[#39ff14] font-mono">
                        {formatAddress(state.walletAddress)}
                      </span>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="text-red-500"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="w-full flex items-center justify-center gap-2 btn-primary"
                  >
                    <Wallet size={18} />
                    Connect Wallet & Sync
                  </button>
                )}
                
                {!state.walletAddress && (
                  <p className="text-xs text-gray-500 text-center mt-2 px-4">
                    Connect wallet to save progress to cloud
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
