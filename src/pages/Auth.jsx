import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { signUp, logIn } from '../utils/firebase';
import { useApp } from '../context/AppContext';

export default function Auth({ onClose }) {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (!isLogin && !form.displayName) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }
    
    if (isLogin) {
      const { user, error } = await logIn(form.email, form.password);
      if (error) {
        setError(error);
      } else if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        if (onClose) onClose();
      }
    } else {
      const { user, error } = await signUp(form.email, form.password, form.displayName);
      if (error) {
        setError(error);
      } else if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        if (onClose) onClose();
      }
    }
    
    setLoading(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md glass-card rounded-2xl p-6 border border-[#2a2a3a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">💎</span>
          <h2 
            className="text-2xl font-bold bg-gradient-to-r from-[#39ff14] to-[#bf00ff] bg-clip-text text-transparent"
            style={{ fontFamily: 'Orbitron' }}
          >
            {isLogin ? 'Welcome Back' : 'Join GG Mindset'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin ? 'Login to sync your progress' : 'Create account to save progress'}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Your Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Login' : 'Create Account'}
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-gray-400 hover:text-[#39ff14] transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Continue as guest
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
