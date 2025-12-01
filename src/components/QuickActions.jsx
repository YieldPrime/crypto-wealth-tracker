import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Target, 
  Calculator, 
  PenTool, 
  Gift,
  Wallet,
  TrendingUp,
  Plus
} from 'lucide-react';

const actions = [
  { id: 'chapters', label: 'Continue Learning', icon: BookOpen, color: '#39ff14', page: 'chapters' },
  { id: 'profit', label: 'Book Profit', icon: TrendingUp, color: '#ffd700', page: 'tools' },
  { id: 'goal', label: 'Add Goal', icon: Target, color: '#bf00ff', page: 'goals' },
  { id: 'dream', label: 'Add Dream', icon: Gift, color: '#ff6b35', page: 'dreams' },
  { id: 'journal', label: 'Write Journal', icon: PenTool, color: '#00ffff', page: 'journal' },
  { id: 'portfolio', label: 'Update Portfolio', icon: Wallet, color: '#39ff14', page: 'tools' },
];

export default function QuickActions({ setCurrentPage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#39ff14]/20 flex items-center justify-center">
          <Plus size={20} className="text-[#39ff14]" />
        </div>
        <div>
          <h3 className="font-bold text-white">Quick Actions</h3>
          <p className="text-xs text-gray-500">Jump to common tasks</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action, idx) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(action.page)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#39ff14]/50 transition-all group"
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: `${action.color}20` }}
            >
              <action.icon size={20} style={{ color: action.color }} />
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
