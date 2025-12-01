import { motion } from 'framer-motion';

export default function Logo({ size = 40, animate = false, showText = true }) {
  const logoSize = size;
  const fontSize = size * 0.4;
  
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="relative"
        animate={animate ? {
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg 
          width={logoSize} 
          height={logoSize} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer glow */}
          <defs>
            <linearGradient id="ggGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39ff14" />
              <stop offset="100%" stopColor="#bf00ff" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39ff14" />
              <stop offset="50%" stopColor="#00ffff" />
              <stop offset="100%" stopColor="#bf00ff" />
            </linearGradient>
          </defs>
          
          {/* Diamond shape background */}
          <motion.path
            d="M50 5 L95 50 L50 95 L5 50 Z"
            fill="url(#diamondGradient)"
            fillOpacity="0.15"
            stroke="url(#ggGradient)"
            strokeWidth="2"
            filter="url(#glow)"
            initial={{ scale: 0.9 }}
            animate={animate ? { scale: [0.9, 1, 0.9] } : { scale: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Inner diamond */}
          <path
            d="M50 20 L80 50 L50 80 L20 50 Z"
            fill="none"
            stroke="url(#ggGradient)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          
          {/* GG Text */}
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill="url(#ggGradient)"
            fontSize="28"
            fontWeight="bold"
            fontFamily="Orbitron, sans-serif"
            filter="url(#glow)"
          >
            GG
          </text>
        </svg>
        
        {/* Sparkle effect */}
        {animate && (
          <>
            <motion.div
              className="absolute top-0 right-0 w-2 h-2 bg-[#39ff14] rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-[#bf00ff] rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1
              }}
            />
          </>
        )}
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <span 
            className="font-bold bg-gradient-to-r from-[#39ff14] to-[#bf00ff] bg-clip-text text-transparent leading-tight"
            style={{ fontFamily: 'Orbitron', fontSize: fontSize }}
          >
            GG MINDSET
          </span>
          <span 
            className="text-gray-500 leading-tight"
            style={{ fontSize: fontSize * 0.5 }}
          >
            VAULT
          </span>
        </div>
      )}
    </div>
  );
}
