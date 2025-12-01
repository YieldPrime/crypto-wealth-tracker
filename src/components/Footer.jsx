import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 py-8 mt-12 border-t border-[#1f1f2e]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span>by</span>
            <a 
              href="https://twitter.com/YieldPrime" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#39ff14] hover:text-[#bf00ff] transition-colors font-medium"
            >
              @YieldPrime
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://twitter.com/YieldPrime" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#1da1f2] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            💎 GG Mindset Vault - Your crypto wealth journey starts here
          </p>
        </div>
      </div>
    </footer>
  );
}
