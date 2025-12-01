import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = '#39ff14',
  trend,
  trendValue,
  delay = 0 
}) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <TrendingUp size={14} className="text-[#39ff14]" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-gray-500" />;
  };
  
  const getTrendColor = () => {
    if (trend === 'up') return 'text-[#39ff14]';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl p-4 border border-[#2a2a3a] hover:border-[#39ff14]/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <div 
          className="text-2xl font-bold mb-1"
          style={{ color, fontFamily: 'Orbitron' }}
        >
          {value}
        </div>
        <div className="text-sm text-white font-medium">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
        )}
      </div>
    </motion.div>
  );
}
