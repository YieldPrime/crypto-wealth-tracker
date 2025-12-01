import { Heart, ExternalLink } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative z-10 py-8 mt-12 border-t border-[#1f1f2e] bg-[#0a0a0f]/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Logo size={32} showText={false} />
            <div className="text-sm text-gray-500">
              <span>© {currentYear} GG Mindset Vault</span>
            </div>
          </div>
          
          {/* Made with love */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <a 
              href="https://twitter.com/YieldPrime" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#39ff14] hover:text-[#bf00ff] transition-colors font-bold flex items-center gap-1"
            >
              @YieldPrime
              <ExternalLink size={12} />
            </a>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://twitter.com/YieldPrime" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#1da1f2] transition-colors group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500 group-hover:text-[#1da1f2] transition-colors">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-xs text-gray-500 group-hover:text-white transition-colors">Follow</span>
            </a>
          </div>
        </div>
        
        {/* Bottom tagline */}
        <div className="mt-6 pt-6 border-t border-[#1f1f2e] text-center">
          <p className="text-xs text-gray-600">
            💎 Your crypto wealth journey starts here • Book profits, build wealth, live the GG life
          </p>
        </div>
      </div>
    </footer>
  );
}
