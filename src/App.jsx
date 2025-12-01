import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Chapters from './pages/Chapters';
import Tools from './pages/Tools';
import Goals from './pages/Goals';
import Dreams from './pages/Dreams';
import Journal from './pages/Journal';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl mb-4"
        >
          💎
        </motion.div>
        <h1 
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#39ff14] to-[#bf00ff] bg-clip-text text-transparent mb-4"
          style={{ fontFamily: 'Orbitron' }}
        >
          GG Mindset Vault
        </h1>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#39ff14]"
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #39ff14 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #bf00ff 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}

function AppContent() {
  const { state } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Wait for auth to initialize
  if (state.authLoading) {
    return <LoadingScreen />;
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'chapters':
        return <Chapters />;
      case 'tools':
        return <Tools />;
      case 'goals':
        return <Goals />;
      case 'dreams':
        return <Dreams />;
      case 'journal':
        return <Journal />;
      case 'reminders':
        return <Reminders />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };
  
  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      {!isLoading && (
        <>
          <BackgroundEffects />
          <Navbar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            onAuthClick={() => setShowAuth(true)}
          />
          <AnimatePresence mode="wait">
            <motion.main
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {renderPage()}
            </motion.main>
          </AnimatePresence>
          
          <AnimatePresence>
            {showAuth && (
              <Auth onClose={() => setShowAuth(false)} />
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
