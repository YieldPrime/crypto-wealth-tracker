import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Twitter, 
  MessageCircle,
  Wallet,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  Trophy,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRankByXP, calculateProgress } from '../data/guideData';

const avatarOptions = ['🦊', '🐺', '🦁', '🐯', '🦅', '🐉', '🦈', '🐋', '💎', '🚀', '⚡', '🔥', '👑', '🎯', '💰', '🏆'];

export default function Profile() {
  const { state, dispatch } = useApp();
  const [editingProfile, setEditingProfile] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    displayName: state.profile.displayName || '',
    bio: state.profile.bio || '',
    twitter: state.profile.twitter || '',
    discord: state.profile.discord || '',
    avatar: state.profile.avatar || '🦊'
  });
  const [walletForm, setWalletForm] = useState({
    label: '',
    address: '',
    network: 'ethereum'
  });
  
  const currentRank = getRankByXP(state.xp);
  const overallProgress = calculateProgress(state.progress);
  
  const handleSaveProfile = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profileForm });
    setEditingProfile(false);
  };
  
  const handleAddWallet = () => {
    if (!walletForm.address || !walletForm.label) return;
    
    if (editingWalletId) {
      dispatch({ 
        type: 'UPDATE_WALLET', 
        payload: { id: editingWalletId, ...walletForm } 
      });
      setEditingWalletId(null);
    } else {
      dispatch({ type: 'ADD_WALLET', payload: walletForm });
    }
    
    setWalletForm({ label: '', address: '', network: 'ethereum' });
    setShowWalletForm(false);
  };
  
  const handleEditWallet = (wallet) => {
    setWalletForm({
      label: wallet.label,
      address: wallet.address,
      network: wallet.network || 'ethereum'
    });
    setEditingWalletId(wallet.id);
    setShowWalletForm(true);
  };
  
  const handleDeleteWallet = (id) => {
    dispatch({ type: 'DELETE_WALLET', payload: id });
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const getNetworkColor = (network) => {
    switch (network) {
      case 'ethereum': return '#627eea';
      case 'bsc': return '#f3ba2f';
      case 'polygon': return '#8247e5';
      case 'solana': return '#00ffa3';
      case 'arbitrum': return '#28a0f0';
      case 'optimism': return '#ff0420';
      default: return '#888';
    }
  };
  
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#39ff14]/20 to-[#bf00ff]/20 border-2 border-[#39ff14]/50 flex items-center justify-center text-5xl"
              >
                {state.profile.avatar || '🦊'}
              </div>
              <div 
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ background: currentRank.color }}
              >
                {currentRank.icon}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 
                className="text-2xl font-bold text-white mb-1"
                style={{ fontFamily: 'Orbitron' }}
              >
                {state.profile.displayName || state.user?.displayName || 'GG Grinder'}
              </h1>
              <p className="text-gray-400 text-sm mb-3">
                {state.profile.bio || 'Building wealth with the GG Mindset'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <Zap size={16} className="text-[#ffd700]" />
                  <span className="text-[#ffd700] font-bold">{state.xp}</span>
                  <span className="text-gray-500">XP</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Flame size={16} className="text-[#ff6b35]" />
                  <span className="text-[#ff6b35] font-bold">{state.streak}</span>
                  <span className="text-gray-500">day streak</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Trophy size={16} className="text-[#39ff14]" />
                  <span className="text-[#39ff14] font-bold">{overallProgress}%</span>
                  <span className="text-gray-500">complete</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setEditingProfile(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          </div>
          
          {(state.profile.twitter || state.profile.discord) && (
            <div className="mt-6 pt-6 border-t border-[#2a2a3a] flex flex-wrap gap-4">
              {state.profile.twitter && (
                <a 
                  href={`https://twitter.com/${state.profile.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1da1f2] transition-colors"
                >
                  <Twitter size={16} />
                  @{state.profile.twitter}
                </a>
              )}
              {state.profile.discord && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MessageCircle size={16} />
                  {state.profile.discord}
                </div>
              )}
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#bf00ff]/20 flex items-center justify-center">
                <Wallet size={20} className="text-[#bf00ff]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">My Wallets</h2>
                <p className="text-sm text-gray-500">{state.wallets.length} saved</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowWalletForm(true);
                setEditingWalletId(null);
                setWalletForm({ label: '', address: '', network: 'ethereum' });
              }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Wallet
            </button>
          </div>
          
          <AnimatePresence>
            {showWalletForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a]"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Label</label>
                    <input
                      type="text"
                      placeholder="e.g., Main Wallet"
                      value={walletForm.label}
                      onChange={(e) => setWalletForm({ ...walletForm, label: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={walletForm.address}
                      onChange={(e) => setWalletForm({ ...walletForm, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Network</label>
                    <select
                      value={walletForm.network}
                      onChange={(e) => setWalletForm({ ...walletForm, network: e.target.value })}
                    >
                      <option value="ethereum">Ethereum</option>
                      <option value="bsc">BSC</option>
                      <option value="polygon">Polygon</option>
                      <option value="arbitrum">Arbitrum</option>
                      <option value="optimism">Optimism</option>
                      <option value="solana">Solana</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddWallet} className="btn-primary text-sm">
                    <Check size={16} className="inline mr-1" />
                    {editingWalletId ? 'Update' : 'Save'} Wallet
                  </button>
                  <button 
                    onClick={() => {
                      setShowWalletForm(false);
                      setEditingWalletId(null);
                    }}
                    className="btn-secondary text-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {state.wallets.length === 0 ? (
            <div className="text-center py-8">
              <Wallet size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500">No wallets saved yet</p>
              <p className="text-gray-600 text-sm">Add your wallet addresses to keep track of them</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.wallets.map((wallet) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] flex items-center gap-4"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${getNetworkColor(wallet.network)}20` }}
                  >
                    <Shield size={20} style={{ color: getNetworkColor(wallet.network) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{wallet.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-mono">
                        {formatAddress(wallet.address)}
                      </span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded capitalize"
                        style={{ 
                          background: `${getNetworkColor(wallet.network)}20`,
                          color: getNetworkColor(wallet.network)
                        }}
                      >
                        {wallet.network}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(wallet.address)}
                      className="p-2 text-gray-500 hover:text-[#39ff14] transition-colors"
                      title="Copy address"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleEditWallet(wallet)}
                      className="p-2 text-gray-500 hover:text-[#39ff14] transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {state.isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#39ff14]/20 flex items-center justify-center">
                <Mail size={20} className="text-[#39ff14]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Account</h2>
                <p className="text-sm text-gray-500">{state.user?.email}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/30">
              <p className="text-sm text-[#39ff14]">
                ✓ Cloud sync enabled. Your progress is automatically saved.
              </p>
            </div>
          </motion.div>
        )}
        
        <AnimatePresence>
          {editingProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              onClick={() => setEditingProfile(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg glass-card rounded-2xl p-6 border border-[#2a2a3a]"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Avatar</label>
                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setProfileForm({ ...profileForm, avatar: emoji })}
                          className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                            profileForm.avatar === emoji
                              ? 'bg-[#39ff14]/20 border-2 border-[#39ff14]'
                              : 'bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#39ff14]/50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about yourself..."
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Twitter</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                        <input
                          type="text"
                          placeholder="username"
                          value={profileForm.twitter}
                          onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Discord</label>
                      <input
                        type="text"
                        placeholder="username#0000"
                        value={profileForm.discord}
                        onChange={(e) => setProfileForm({ ...profileForm, discord: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSaveProfile} className="btn-primary flex-1">
                    Save Changes
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
