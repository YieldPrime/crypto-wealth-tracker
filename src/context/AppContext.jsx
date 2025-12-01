import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveUserData, loadUserData, onAuthChange, logOut } from '../utils/firebase';

const AppContext = createContext();

const STORAGE_KEY = 'gg-mindset-vault-data';

const getInitialState = () => ({
  // Auth
  user: null,
  isLoggedIn: false,
  authLoading: true,
  
  // Profile
  profile: {
    displayName: '',
    email: '',
    bio: '',
    twitter: '',
    discord: '',
    avatar: '🦊'
  },
  
  // Saved wallets
  wallets: [],
  connectedWallet: null,
  
  // App data
  userId: uuidv4(),
  xp: 0,
  streak: 0,
  lastVisit: null,
  level: 1,
  progress: {},
  goals: [],
  profitBookings: [],
  portfolioAllocation: {
    ledger: 0,
    hotWallet: 0,
    bank: 0,
    exchange: 0
  },
  dreamList: [],
  bankBackupBalance: 0,
  bankBackupTarget: 500000,
  monthlyIncome: [],
  habitLog: {},
  journalEntries: [],
  reminders: [],
  completedCelebration: false,
  cloudSyncEnabled: false,
  lastSynced: null
});

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload };
      
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isLoggedIn: !!action.payload,
        authLoading: false,
        cloudSyncEnabled: !!action.payload
      };
      
    case 'LOAD_CLOUD_DATA':
      // Completely replace state with cloud data
      return {
        ...state,
        ...action.payload,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        authLoading: false,
        cloudSyncEnabled: true
      };
      
    case 'LOAD_LOCAL_DATA':
      return { 
        ...state, 
        ...action.payload,
        authLoading: false
      };
      
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload }
      };
    
    case 'CONNECT_WALLET':
      return {
        ...state,
        connectedWallet: action.payload
      };
      
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        connectedWallet: null
      };
      
    case 'ADD_WALLET':
      if (state.wallets.some(w => w.address.toLowerCase() === action.payload.address.toLowerCase())) {
        return state;
      }
      return {
        ...state,
        wallets: [...state.wallets, { ...action.payload, id: uuidv4() }]
      };
      
    case 'UPDATE_WALLET':
      return {
        ...state,
        wallets: state.wallets.map(w => 
          w.id === action.payload.id ? { ...w, ...action.payload } : w
        )
      };
      
    case 'DELETE_WALLET':
      return {
        ...state,
        wallets: state.wallets.filter(w => w.id !== action.payload)
      };
      
    case 'SET_CLOUD_SYNCED':
      return {
        ...state,
        lastSynced: new Date().toISOString()
      };
      
    case 'UPDATE_STREAK': {
      const today = new Date().toDateString();
      const lastVisitDate = state.lastVisit ? new Date(state.lastVisit).toDateString() : null;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      let newStreak = state.streak;
      if (lastVisitDate === today) {
        newStreak = state.streak;
      } else if (lastVisitDate === yesterday) {
        newStreak = state.streak + 1;
      } else {
        newStreak = 1;
      }
      
      return {
        ...state,
        streak: newStreak,
        lastVisit: new Date().toISOString()
      };
    }
    
    case 'ADD_XP':
      return {
        ...state,
        xp: state.xp + action.payload
      };
      
    case 'UPDATE_PROGRESS': {
      const { chapterId, sectionId, field, value } = action.payload;
      const chapterProgress = state.progress[chapterId] || {};
      const sectionProgress = chapterProgress[sectionId] || { understood: false, implemented: false };
      
      return {
        ...state,
        progress: {
          ...state.progress,
          [chapterId]: {
            ...chapterProgress,
            [sectionId]: {
              ...sectionProgress,
              [field]: value
            }
          }
        }
      };
    }
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, { ...action.payload, id: uuidv4(), createdAt: new Date().toISOString() }]
      };
      
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g)
      };
      
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload)
      };
      
    case 'ADD_PROFIT_BOOKING':
      return {
        ...state,
        profitBookings: [...state.profitBookings, { ...action.payload, id: uuidv4(), date: new Date().toISOString() }]
      };
      
    case 'UPDATE_PORTFOLIO':
      return {
        ...state,
        portfolioAllocation: { ...state.portfolioAllocation, ...action.payload }
      };
      
    case 'ADD_DREAM':
      return {
        ...state,
        dreamList: [...state.dreamList, { ...action.payload, id: uuidv4(), funded: false }]
      };
      
    case 'UPDATE_DREAM':
      return {
        ...state,
        dreamList: state.dreamList.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d)
      };
      
    case 'DELETE_DREAM':
      return {
        ...state,
        dreamList: state.dreamList.filter(d => d.id !== action.payload)
      };
      
    case 'UPDATE_BANK_BACKUP':
      return {
        ...state,
        bankBackupBalance: action.payload.balance ?? state.bankBackupBalance,
        bankBackupTarget: action.payload.target ?? state.bankBackupTarget
      };
      
    case 'ADD_MONTHLY_INCOME':
      return {
        ...state,
        monthlyIncome: [...state.monthlyIncome, { ...action.payload, id: uuidv4() }]
      };
      
    case 'LOG_HABIT': {
      const today = new Date().toDateString();
      const todayLog = state.habitLog[today] || [];
      const habitId = action.payload;
      
      if (todayLog.includes(habitId)) {
        return {
          ...state,
          habitLog: {
            ...state.habitLog,
            [today]: todayLog.filter(h => h !== habitId)
          }
        };
      }
      
      return {
        ...state,
        habitLog: {
          ...state.habitLog,
          [today]: [...todayLog, habitId]
        }
      };
    }
    
    case 'ADD_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: [
          { ...action.payload, id: uuidv4(), date: new Date().toISOString() },
          ...state.journalEntries
        ]
      };
      
    case 'UPDATE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.map(j => 
          j.id === action.payload.id ? { ...j, ...action.payload } : j
        )
      };
      
    case 'DELETE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.filter(j => j.id !== action.payload)
      };
      
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, { ...action.payload, id: uuidv4() }]
      };
      
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(r => r.id !== action.payload)
      };
      
    case 'SET_COMPLETED_CELEBRATION':
      return {
        ...state,
        completedCelebration: action.payload
      };
      
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);
  const isInitialized = useRef(false);
  const syncTimeoutRef = useRef(null);
  const lastSavedRef = useRef('');
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      console.log('Auth state changed:', user ? user.email : 'logged out');
      
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        
        // ALWAYS load from cloud when user logs in
        console.log('Loading data from cloud for:', user.uid);
        const cloudData = await loadUserData(user.uid);
        
        if (cloudData) {
          console.log('Cloud data found, loading...');
          dispatch({ type: 'LOAD_CLOUD_DATA', payload: cloudData });
        } else {
          console.log('No cloud data, starting fresh');
        }
        
        // Update profile with user info
        dispatch({ type: 'UPDATE_PROFILE', payload: {
          displayName: user.displayName || '',
          email: user.email || ''
        }});
        
        dispatch({ type: 'UPDATE_STREAK' });
        
      } else {
        // User logged out - load from localStorage
        dispatch({ type: 'SET_USER', payload: null });
        
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            dispatch({ type: 'LOAD_LOCAL_DATA', payload: parsed });
          } catch (e) {
            console.error('Failed to load local data:', e);
          }
        }
        
        dispatch({ type: 'UPDATE_STREAK' });
      }
      
      isInitialized.current = true;
    });
    
    return () => unsubscribe();
  }, []);
  
  // Save to localStorage for guests
  useEffect(() => {
    if (!isInitialized.current) return;
    if (!state.isLoggedIn && state.userId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, state.isLoggedIn, state.userId]);
  
  // Sync to cloud for logged in users
  useEffect(() => {
    if (!isInitialized.current) return;
    if (!state.isLoggedIn || !state.user) return;
    
    const dataToSave = {
      profile: state.profile,
      wallets: state.wallets,
      connectedWallet: state.connectedWallet,
      xp: state.xp,
      streak: state.streak,
      lastVisit: state.lastVisit,
      progress: state.progress,
      goals: state.goals,
      profitBookings: state.profitBookings,
      portfolioAllocation: state.portfolioAllocation,
      dreamList: state.dreamList,
      bankBackupBalance: state.bankBackupBalance,
      bankBackupTarget: state.bankBackupTarget,
      monthlyIncome: state.monthlyIncome,
      habitLog: state.habitLog,
      journalEntries: state.journalEntries,
      reminders: state.reminders,
      completedCelebration: state.completedCelebration
    };
    
    const dataString = JSON.stringify(dataToSave);
    
    // Only sync if data actually changed
    if (dataString === lastSavedRef.current) return;
    
    // Clear previous timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    // Debounce sync
    syncTimeoutRef.current = setTimeout(async () => {
      console.log('Syncing to cloud...');
      const success = await saveUserData(state.user.uid, dataToSave);
      if (success) {
        lastSavedRef.current = dataString;
        dispatch({ type: 'SET_CLOUD_SYNCED' });
        console.log('Sync complete');
      }
    }, 1000);
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [
    state.isLoggedIn,
    state.user,
    state.profile,
    state.wallets,
    state.connectedWallet,
    state.xp,
    state.streak,
    state.lastVisit,
    state.progress,
    state.goals,
    state.profitBookings,
    state.portfolioAllocation,
    state.dreamList,
    state.bankBackupBalance,
    state.bankBackupTarget,
    state.monthlyIncome,
    state.habitLog,
    state.journalEntries,
    state.reminders,
    state.completedCelebration
  ]);
  
  const handleLogout = useCallback(async () => {
    await logOut();
    localStorage.removeItem(STORAGE_KEY);
    // Refresh page to reset everything
    window.location.reload();
  }, []);
  
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        dispatch({ type: 'CONNECT_WALLET', payload: accounts[0] });
        return accounts[0];
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        return null;
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet');
      return null;
    }
  }, []);
  
  const disconnectWallet = useCallback(() => {
    dispatch({ type: 'DISCONNECT_WALLET' });
  }, []);
  
  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      handleLogout,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
