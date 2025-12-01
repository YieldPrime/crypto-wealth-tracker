import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRankByXP, calculateProgress } from '../data/guideData';

export default function Leaderboard() {
  const { state } = useApp();
  
  const currentRank = getRankByXP(state.xp);
  const progress = calculateProgress(state.progress);
  
  // Mock leaderboard data (in real app, fetch from Firebase)
  const leaderboardData = [
    { rank: 1, name: 'DiamondHands', xp: 15420, avatar: '👑' },
    { rank: 2, name: 'CryptoWhale', xp: 12350, avatar: '🐋' },
    { rank: 3, name: 'ProfitKing', xp: 9870, avatar: '💎' },
    { rank: 4, name: state.profile.displayName || 'You', xp: state.xp, avatar: state.profile.avatar || '🦊', isYou: true },
    { rank: 5, name: 'MoonHunter', xp: 4520, avatar: '🚀' },
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));
  
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="text-[#ffd700]" size={20} />;
      case 2: return <Medal className="text-[#c0c0c0]" size={20} />;
      case 3: return <Award className="text-[#cd7f32]" size={20} />;
      default: return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffd700]/20 flex items-center justify-center">
            <Trophy size={20} className="text-[#ffd700]" />
          </div>
          <div>
            <h3 className="font-bold text-white">Leaderboard</h3>
            <p className="text-xs text-gray-500">Top GG Grinders</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TrendingUp size={14} />
          <span>This Week</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {leaderboardData.map((user, idx) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
              user.isYou 
                ? 'bg-gradient-to-r from-[#39ff14]/10 to-[#bf00ff]/10 border border-[#39ff14]/30' 
                : 'bg-[#1a1a24] hover:bg-[#1f1f2e]'
            }`}
          >
            <div className="w-8 flex justify-center">
              {getRankIcon(user.rank)}
            </div>
            <div className="text-2xl">{user.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${user.isYou ? 'text-[#39ff14]' : 'text-white'}`}>
                  {user.name}
                </span>
                {user.isYou && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[#39ff14]/20 text-[#39ff14]">
                    You
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#ffd700]" style={{ fontFamily: 'Orbitron' }}>
                {user.xp.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#2a2a3a] text-center">
        <p className="text-xs text-gray-500">
          Keep grinding to climb the ranks! 💪
        </p>
      </div>
    </motion.div>
  );
}
