import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, BookOpen, Calendar, Flame, Crown, Diamond, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateProgress } from '../data/guideData';

const achievements = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first chapter section',
    icon: Star,
    color: '#ffd700',
    check: (state) => Object.keys(state.progress).length > 0
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Complete 50% of all chapters',
    icon: BookOpen,
    color: '#39ff14',
    check: (state) => calculateProgress(state.progress) >= 50
  },
  {
    id: 'master',
    title: 'GG Master',
    description: 'Complete 100% of all chapters',
    icon: Crown,
    color: '#bf00ff',
    check: (state) => calculateProgress(state.progress) >= 100
  },
  {
    id: 'xp-100',
    title: 'Getting Started',
    description: 'Earn 100 XP',
    icon: Zap,
    color: '#ffd700',
    check: (state) => state.xp >= 100
  },
  {
    id: 'xp-500',
    title: 'Rising Star',
    description: 'Earn 500 XP',
    icon: Rocket,
    color: '#ff6b35',
    check: (state) => state.xp >= 500
  },
  {
    id: 'xp-1000',
    title: 'Power Player',
    description: 'Earn 1,000 XP',
    icon: Diamond,
    color: '#00ffff',
    check: (state) => state.xp >= 1000
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    color: '#ff6b35',
    check: (state) => state.streak >= 7
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: Calendar,
    color: '#bf00ff',
    check: (state) => state.streak >= 30
  },
  {
    id: 'goal-setter',
    title: 'Goal Setter',
    description: 'Create your first financial goal',
    icon: Target,
    color: '#39ff14',
    check: (state) => state.goals.length > 0
  },
  {
    id: 'profit-booker',
    title: 'Profit Booker',
    description: 'Book your first profit',
    icon: Trophy,
    color: '#ffd700',
    check: (state) => state.profitBookings.length > 0
  },
  {
    id: 'dream-funded',
    title: 'Dream Achiever',
    description: 'Fund your first dream item',
    icon: Star,
    color: '#bf00ff',
    check: (state) => state.dreamList.some(d => d.funded)
  },
  {
    id: 'journal-writer',
    title: 'Journal Writer',
    description: 'Write 5 journal entries',
    icon: BookOpen,
    color: '#00ffff',
    check: (state) => state.journalEntries.length >= 5
  }
];

export default function Achievements() {
  const { state } = useApp();
  
  const unlockedCount = achievements.filter(a => a.check(state)).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#bf00ff]/20 flex items-center justify-center">
            <Trophy size={20} className="text-[#bf00ff]" />
          </div>
          <div>
            <h3 className="font-bold text-white">Achievements</h3>
            <p className="text-xs text-gray-500">{unlockedCount}/{achievements.length} unlocked</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {achievements.map((achievement, idx) => {
          const isUnlocked = achievement.check(state);
          const Icon = achievement.icon;
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative group cursor-pointer`}
            >
              <div 
                className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-[#1a1a24] to-[#2a2a3a] border-2' 
                    : 'bg-[#1a1a24] border border-[#2a2a3a] opacity-40'
                }`}
                style={{ borderColor: isUnlocked ? achievement.color : undefined }}
              >
                <Icon 
                  size={24} 
                  style={{ color: isUnlocked ? achievement.color : '#555' }}
                />
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#39ff14] flex items-center justify-center"
                  >
                    <span className="text-black text-xs">✓</span>
                  </motion.div>
                )}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-lg p-2 text-center whitespace-nowrap">
                  <p className="text-xs font-bold text-white">{achievement.title}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
