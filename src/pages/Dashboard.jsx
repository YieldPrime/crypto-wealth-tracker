import { motion } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Target, 
  BookOpen,
  Wallet,
  TrendingUp,
  DollarSign,
  Calendar,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRankByXP, calculateProgress, guideData } from '../data/guideData';
import ProgressRing from '../components/ProgressRing';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import DailyTip from '../components/DailyTip';
import Achievements from '../components/Achievements';
import Logo from '../components/Logo';

export default function Dashboard({ setCurrentPage }) {
  const { state } = useApp();
  
  const currentRank = getRankByXP(state.xp);
  const nextRank = getRankByXP(state.xp + 1000);
  const overallProgress = calculateProgress(state.progress);
  
  // Calculate stats
  const totalProfitBooked = state.profitBookings.reduce((acc, p) => acc + (p.amount || 0), 0);
  const goalsCompleted = state.goals.filter(g => g.current >= g.target).length;
  const dreamsFunded = state.dreamList.filter(d => d.funded).length;
  const totalHabitsToday = state.habitLog[new Date().toDateString()]?.length || 0;
  
  // Calculate chapter progress
  const chapterProgress = guideData.map(chapter => {
    const chapterData = state.progress[chapter.id] || {};
    const totalSections = chapter.sections.length;
    const completedSections = Object.values(chapterData).filter(
      s => s.understood && s.implemented
    ).length;
    return {
      ...chapter,
      progress: totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0
    };
  });
  
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8 border border-[#2a2a3a] relative overflow-hidden"
        >
          {/* Background decoration */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 opacity-20"
            style={{
              background: 'radial-gradient(circle, #39ff14 0%, transparent 70%)',
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 opacity-10"
            style={{
              background: 'radial-gradient(circle, #bf00ff 0%, transparent 70%)',
            }}
          />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Progress Ring */}
            <div className="relative">
              <ProgressRing progress={overallProgress} size={140} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span 
                  className="text-3xl font-bold text-[#39ff14]"
                  style={{ fontFamily: 'Orbitron' }}
                >
                  {overallProgress}%
                </span>
                <span className="text-xs text-gray-500">Complete</span>
              </div>
            </div>
            
            {/* Welcome Text */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {state.isLoggedIn 
                  ? `Welcome back, ${state.profile.displayName || 'Grinder'}!`
                  : 'Welcome to GG Mindset Vault!'
                }
              </h1>
              <p className="text-gray-400 mb-4">
                {overallProgress < 25 
                  ? "You're just getting started. Let's build that GG mindset! 💎"
                  : overallProgress < 50
                  ? "Great progress! Keep grinding and learning. 📚"
                  : overallProgress < 75
                  ? "You're doing amazing! More than halfway there. 🚀"
                  : overallProgress < 100
                  ? "Almost there! The finish line is in sight. 🏆"
                  : "You've mastered the GG Mindset! Now implement it! 👑"
                }
              </p>
              
              {/* Rank Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1a1a24] border border-[#2a2a3a]">
                <span className="text-2xl">{currentRank.icon}</span>
                <div>
                  <div className="font-bold" style={{ color: currentRank.color }}>
                    {currentRank.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {state.xp.toLocaleString()} XP
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logo Animation */}
            <div className="hidden lg:block">
              <Logo size={80} animate={true} showText={false} />
            </div>
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total XP"
            value={state.xp.toLocaleString()}
            subtitle={`${currentRank.name}`}
            icon={Zap}
            color="#ffd700"
            trend="up"
            trendValue="+10 today"
            delay={0}
          />
          <StatsCard
            title="Day Streak"
            value={state.streak}
            subtitle="Keep it up!"
            icon={Flame}
            color="#ff6b35"
            delay={0.1}
          />
          <StatsCard
            title="Profit Booked"
            value={`$${totalProfitBooked.toLocaleString()}`}
            subtitle={`${state.profitBookings.length} trades`}
            icon={TrendingUp}
            color="#39ff14"
            delay={0.2}
          />
          <StatsCard
            title="Goals"
            value={`${goalsCompleted}/${state.goals.length}`}
            subtitle="completed"
            icon={Target}
            color="#bf00ff"
            delay={0.3}
          />
        </div>
        
        {/* Daily Tip */}
        <DailyTip />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Chapter Progress */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions */}
            <QuickActions setCurrentPage={setCurrentPage} />
            
            {/* Chapter Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#39ff14]/20 flex items-center justify-center">
                    <BookOpen size={20} className="text-[#39ff14]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Chapter Progress</h3>
                    <p className="text-xs text-gray-500">{overallProgress}% overall</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage('chapters')}
                  className="text-sm text-[#39ff14] hover:underline"
                >
                  View All →
                </button>
              </div>
              
              <div className="space-y-4">
                {chapterProgress.map((chapter, idx) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chapter.icon}</span>
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                          {chapter.title.length > 30 
                            ? chapter.title.substring(0, 30) + '...'
                            : chapter.title
                          }
                        </span>
                      </div>
                      <span 
                        className="text-sm font-bold"
                        style={{ 
                          color: chapter.progress === 100 ? '#39ff14' : '#888',
                          fontFamily: 'Orbitron'
                        }}
                      >
                        {chapter.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: chapter.progress === 100 
                            ? 'linear-gradient(90deg, #39ff14, #00ff88)'
                            : 'linear-gradient(90deg, #39ff14, #bf00ff)',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${chapter.progress}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Achievements */}
            <Achievements />
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Portfolio Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#bf00ff]/20 flex items-center justify-center">
                  <Wallet size={20} className="text-[#bf00ff]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Portfolio</h3>
                  <p className="text-xs text-gray-500">40/15/25/20 Rule</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { label: 'Ledger', target: 40, color: '#39ff14' },
                  { label: 'Hot Wallet', target: 15, color: '#bf00ff' },
                  { label: 'Bank', target: 25, color: '#ffd700' },
                  { label: 'Exchange', target: 20, color: '#00ffff' },
                ].map((item) => {
                  const total = Object.values(state.portfolioAllocation).reduce((a, b) => a + b, 0);
                  const current = state.portfolioAllocation[item.label.toLowerCase().replace(' ', '')] || 0;
                  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
                  
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{item.label}</span>
                        <span style={{ color: item.color }}>{percentage}% / {item.target}%</span>
                      </div>
                      <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(percentage, 100)}%`,
                            background: item.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage('tools')}
                className="w-full mt-4 btn-secondary text-sm"
              >
                Update Portfolio
              </button>
            </motion.div>
            
            {/* Bank Backup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ffd700]/20 flex items-center justify-center">
                  <DollarSign size={20} className="text-[#ffd700]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Bank Backup</h3>
                  <p className="text-xs text-gray-500">Emergency Fund</p>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <div 
                  className="text-3xl font-bold text-[#ffd700] mb-1"
                  style={{ fontFamily: 'Orbitron' }}
                >
                  ₹{state.bankBackupBalance.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  of ₹{state.bankBackupTarget.toLocaleString()} target
                </div>
              </div>
              
              <div className="h-3 bg-[#1a1a24] rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#ffd700] to-[#ff6b35]"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min((state.bankBackupBalance / state.bankBackupTarget) * 100, 100)}%` 
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
              
              <div className="text-center text-sm text-gray-500">
                {Math.round((state.bankBackupBalance / state.bankBackupTarget) * 100)}% funded
              </div>
            </motion.div>
            
            {/* Today's Habits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#39ff14]/20 flex items-center justify-center">
                  <Calendar size={20} className="text-[#39ff14]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Today's Habits</h3>
                  <p className="text-xs text-gray-500">{totalHabitsToday}/7 completed</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      i <= totalHabitsToday 
                        ? 'bg-[#39ff14] text-black' 
                        : 'bg-[#1a1a24] text-gray-600'
                    }`}
                  >
                    {i <= totalHabitsToday ? '✓' : i}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage('tools')}
                className="w-full btn-primary text-sm"
              >
                {totalHabitsToday === 7 ? '🎉 All Done!' : 'Log Habits'}
              </button>
            </motion.div>
            
            {/* Dreams Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ff6b35]/20 flex items-center justify-center">
                  <Award size={20} className="text-[#ff6b35]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Dreams</h3>
                  <p className="text-xs text-gray-500">{dreamsFunded} funded</p>
                </div>
              </div>
              
              {state.dreamList.length > 0 ? (
                <div className="space-y-2">
                  {state.dreamList.slice(0, 3).map((dream) => (
                    <div 
                      key={dream.id}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        dream.funded ? 'bg-[#39ff14]/10' : 'bg-[#1a1a24]'
                      }`}
                    >
                      <span className={dream.funded ? 'opacity-100' : 'opacity-50'}>
                        {dream.funded ? '✅' : '⏳'}
                      </span>
                      <span className={`text-sm ${dream.funded ? 'text-[#39ff14]' : 'text-gray-400'}`}>
                        {dream.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No dreams added yet
                </p>
              )}
              
              <button
                onClick={() => setCurrentPage('dreams')}
                className="w-full mt-4 btn-secondary text-sm"
              >
                {state.dreamList.length > 0 ? 'View All Dreams' : 'Add Dreams'}
              </button>
            </motion.div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
