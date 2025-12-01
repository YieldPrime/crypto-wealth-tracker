import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw, Share2, Copy, Check } from 'lucide-react';

const tips = [
  {
    category: 'Profit Taking',
    tip: 'Always take 80% profit at your first target. Unrealized gains are not real gains.',
    emoji: '💰'
  },
  {
    category: 'Risk Management',
    tip: 'Never risk more than 2-5% of your portfolio on a single trade.',
    emoji: '🛡️'
  },
  {
    category: 'Portfolio',
    tip: 'Follow the 40/15/25/20 rule: Ledger, Hot Wallet, Bank, Exchange.',
    emoji: '📊'
  },
  {
    category: 'Mindset',
    tip: 'The 1% implement, the 99% just read. Which one are you?',
    emoji: '🧠'
  },
  {
    category: 'DYOR',
    tip: 'Always research tokenomics, team, and community before investing.',
    emoji: '🔍'
  },
  {
    category: 'Patience',
    tip: 'Crypto is a marathon, not a sprint. Build wealth over time.',
    emoji: '⏳'
  },
  {
    category: 'Diversification',
    tip: '80% safe plays (BTC/ETH), 20% high-risk moonshots.',
    emoji: '🎯'
  },
  {
    category: 'Emergency Fund',
    tip: 'Keep 3-6 months expenses in your bank backup before going degen.',
    emoji: '🏦'
  },
  {
    category: 'Emotions',
    tip: 'Never make financial decisions when emotional. Sleep on it.',
    emoji: '😌'
  },
  {
    category: 'Learning',
    tip: 'Spend 1 hour daily learning about crypto and investing.',
    emoji: '📚'
  },
  {
    category: 'Network',
    tip: 'Your network is your net worth. Connect with other grinders.',
    emoji: '🤝'
  },
  {
    category: 'Health',
    tip: 'No wealth without health. Take care of your body first.',
    emoji: '💪'
  }
];

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    setCurrentTip(tips[dayOfYear % tips.length]);
  }, []);
  
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[randomIndex]);
  };
  
  const copyTip = () => {
    if (currentTip) {
      navigator.clipboard.writeText(`${currentTip.emoji} ${currentTip.tip} - GG Mindset`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const shareTip = () => {
    if (currentTip && navigator.share) {
      navigator.share({
        title: 'GG Mindset Tip',
        text: `${currentTip.emoji} ${currentTip.tip}`,
        url: window.location.href
      });
    }
  };
  
  if (!currentTip) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-[#2a2a3a] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{
          background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)',
        }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffd700]/20 flex items-center justify-center">
              <Lightbulb size={20} className="text-[#ffd700]" />
            </div>
            <div>
              <h3 className="font-bold text-white">Daily GG Tip</h3>
              <p className="text-xs text-gray-500">{currentTip.category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={copyTip}
              className="p-2 text-gray-500 hover:text-[#39ff14] transition-colors"
              title="Copy tip"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              onClick={shareTip}
              className="p-2 text-gray-500 hover:text-[#39ff14] transition-colors"
              title="Share tip"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={getRandomTip}
              className="p-2 text-gray-500 hover:text-[#39ff14] transition-colors"
              title="Get new tip"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <span className="text-4xl">{currentTip.emoji}</span>
          <p className="text-lg text-white leading-relaxed">
            {currentTip.tip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
