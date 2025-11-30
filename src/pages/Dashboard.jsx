import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  Trophy, 
  Star,
  ChevronRight,
  Plus,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { guideData, getRankByXP, getNextRank, calculateProgress, getRandomQuote } from '../data/guideData';
import ProgressRing from '../components/ProgressRing';
import { useConfetti } from '../hooks/useConfetti';

export default function Dashboard({ setCurrentPage }) {
  const { state, dispatch } = useApp();
  const [quote, setQuote] = useState('');
  const { fireMassiveCelebration } = useConfetti();
  
  const overallProgress = calculateProgress(state.progress);
  const currentRank = getRankByXP(state.xp);
  const nextRank = getNextRank(state.xp);
  
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);
  
  useEffect(() => {
    if (overallProgress === 100 && !state.completedCelebration) {
      fireMassiveCelebration();
      dispatch({ type: 'SET_COMPLETED_CELEBRATION', payload: true });
    }
  }, [overallProgress, state.completedCelebration]);
  
  const portfolioData = [
    { name: 'Ledger (40%)', value: state.portfolioAllocation.ledger || 0, color: '#39ff14', target: 40 },
    { name: 'Hot Wallet (15%)', value: state.portfolioAllocation.hotWallet || 0, color: '#bf00ff', target: 15 },
    { name: 'Bank (25%)', value: state.portfolioAllocation.bank || 0, color: '#ffd700', target: 25 },
    { name: 'Exchange (20%)', value: state.portfolioAllocation.exchange || 0, color: '#00bfff', target: 20 },
  ];
  
  const totalPortfolio = portfolioData.reduce((acc, item) => acc + item.value, 0);
  
  const habitsCompletedToday = state.habitLog[new Date().toDateString()]?.length || 0;
  const totalHabits = guideData.habits.length;
  
  const totalProfitBooked = state.profitBookings.reduce((acc, booking) => acc + (booking.usdtAmount || 0), 0);
  
  const xpForNextRank = nextRank ? nextRank.minXP - state.xp : 0;
  const xpProgress = nextRank 
    ? ((state.xp - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100
    : 100;
  
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {overallProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gradient-border p-6 text-center"
          >
            <span className="text-6xl mb-4 block">👑</span>
            <h2 
              className="text-2xl font-bold text-[#ffd700] mb-2"
              style={{ fontFamily: 'Orbitron' }}
            >
              GG LEGEND ACHIEVED!
            </h2>
            <p className="text-gray-300">
              You are now part of the 1% who actually implement. Absolute legend.
            </p>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
        >
          <p className="text-lg text-gray-300 italic text-center">
            "{quote}"
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 glass-card rounded-2xl p-6 border border-[#2a2a3a] flex flex-col items-center"
          >
            <h3 
              className="text-lg font-bold text-gray-400 mb-4"
              style={{ fontFamily: 'Orbitron' }}
            >
              OVERALL PROGRESS
            </h3>
            <ProgressRing progress={overallProgress} size={180} />
            <button
              onClick={() => setCurrentPage('chapters')}
              className="mt-4 btn-secondary text-sm flex items-center gap-2"
            >
              Continue Journey
              <ChevronRight size={16} />
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card rounded-2xl p-6 border border-[#2a2a3a]"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="text-center p-4 rounded-xl bg-[#1a1a24]">
                <div className="text-4xl mb-2">{currentRank.icon}</div>
                <div 
                  className="text-sm font-bold"
                  style={{ color: currentRank.color, fontFamily: 'Orbitron' }}
                >
                  {currentRank.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">Current Rank</div>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-[#1a1a24]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="text-[#ffd700]" size={24} />
                  <span 
                    className="text-2xl font-bold text-[#ffd700]"
                    style={{ fontFamily: 'Orbitron' }}
                  >
                    {state.xp}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Total XP</div>
                {nextRank && (
                  <div className="mt-2">
                    <div className="h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full xp-bar rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {xpForNextRank} XP to {nextRank.name}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center p-4 rounded-xl bg-[#1a1a24]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="text-[#ff6b35]" size={24} />
                  <span 
                    className="text-2xl font-bold streak-fire"
                    style={{ fontFamily: 'Orbitron' }}
                  >
                    {state.streak}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-[#1a1a24]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="text-[#39ff14]" size={24} />
                  <span 
                    className="text-2xl font-bold text-[#39ff14]"
                    style={{ fontFamily: 'Orbitron' }}
                  >
                    {habitsCompletedToday}/{totalHabits}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Habits Today</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#39ff14]/10 to-[#bf00ff]/10 border border-[#39ff14]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Total Profit Booked</div>
                  <div 
                    className="text-2xl font-bold text-[#39ff14]"
                    style={{ fontFamily: 'Orbitron' }}
                  >
                    ${totalProfitBooked.toLocaleString()} USDT
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage('tools')}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  Book Profit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
          >
            <h3 
              className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Orbitron' }}
            >
              <TrendingUp className="text-[#39ff14]" size={20} />
              Portfolio Allocation (40/15/25/20)
            </h3>
            
            {totalPortfolio > 0 ? (
              <div className="flex items-center gap-6">
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: '#1a1a24', 
                          border: '1px solid #2a2a3a',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`$${value.toLocaleString()}`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {portfolioData.map((item) => {
                    const percentage = totalPortfolio > 0 
                      ? ((item.value / totalPortfolio) * 100).toFixed(1)
                      : 0;
                    return (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ background: item.color }}
                          />
                          <span className="text-sm text-gray-400">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium" style={{ color: item.color }}>
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No portfolio data yet</p>
                <button
                  onClick={() => setCurrentPage('tools')}
                  className="btn-secondary text-sm"
                >
                  Update Portfolio
                </button>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
          >
            <h3 
              className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Orbitron' }}
            >
              <Star className="text-[#ffd700]" size={20} />
              Chapter Progress
            </h3>
            
            <div className="space-y-3">
              {guideData.chapters.map((chapter) => {
                const chapterProgress = state.progress[chapter.id] || {};
                const totalItems = chapter.sections.length * 2;
                let completed = 0;
                Object.values(chapterProgress).forEach(section => {
                  if (section.understood) completed++;
                  if (section.implemented) completed++;
                });
                const percentage = Math.round((completed / totalItems) * 100);
                
                return (
                  <div key={chapter.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 truncate flex-1">
                        {chapter.icon} {chapter.title}
                      </span>
                      <span className="text-gray-500 ml-2">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: chapter.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + chapter.id * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
          >
            <h3 
              className="text-lg font-bold text-gray-300 mb-4"
              style={{ fontFamily: 'Orbitron' }}
            >
              🎯 My Goals
            </h3>
            {state.goals.length > 0 ? (
              <div className="space-y-3">
                {state.goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="p-3 rounded-lg bg-[#1a1a24]">
                    <div className="font-medium text-gray-300">{goal.name}</div>
                    <div className="text-sm text-[#39ff14]">
                      ${goal.current?.toLocaleString() || 0} / ${goal.target?.toLocaleString()}
                    </div>
                  </div>
                ))}
                {state.goals.length > 3 && (
                  <button
                    onClick={() => setCurrentPage('goals')}
                    className="text-sm text-[#bf00ff] hover:underline"
                  >
                    +{state.goals.length - 3} more goals
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('goals')}
                className="w-full py-8 border-2 border-dashed border-[#2a2a3a] rounded-lg text-gray-500 hover:border-[#39ff14] hover:text-[#39ff14] transition-colors"
              >
                <Plus className="mx-auto mb-2" size={24} />
                Add your first goal
              </button>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
          >
            <h3 
              className="text-lg font-bold text-gray-300 mb-4"
              style={{ fontFamily: 'Orbitron' }}
            >
              🎁 Dream List
            </h3>
            {state.dreamList.length > 0 ? (
              <div className="space-y-3">
                {state.dreamList.slice(0, 3).map((dream) => (
                  <div key={dream.id} className="p-3 rounded-lg bg-[#1a1a24] flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-300">{dream.name}</div>
                      <div className="text-sm text-gray-500">${dream.price?.toLocaleString()}</div>
                    </div>
                    {dream.funded && (
                      <span className="text-[#39ff14] text-xl">✓</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('dreams')}
                className="w-full py-8 border-2 border-dashed border-[#2a2a3a] rounded-lg text-gray-500 hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors"
              >
                <Plus className="mx-auto mb-2" size={24} />
                Add a dream item
              </button>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
          >
            <h3 
              className="text-lg font-bold text-gray-300 mb-4"
              style={{ fontFamily: 'Orbitron' }}
            >
              🏦 Bank Backup
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div 
                  className="text-3xl font-bold text-[#ffd700]"
                  style={{ fontFamily: 'Orbitron' }}
                >
                  ₹{state.bankBackupBalance.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  of ₹{state.bankBackupTarget.toLocaleString()} target
                </div>
              </div>
              <div className="h-3 bg-[#1a1a24] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#ffd700] to-[#ff6b35]"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min((state.bankBackupBalance / state.bankBackupTarget) * 100, 100)}%` 
                  }}
                />
              </div>
              <button
                onClick={() => setCurrentPage('tools')}
                className="w-full btn-secondary text-sm"
              >
                Update Balance
              </button>
            </div>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}
