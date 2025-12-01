import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveUserData, loadUserData, onAuthChange, logOut } from '../utils/firebase';

const AppContext = createContext();

const STORAGE_KEY = 'gg-mindset-vault-data';

const initialState = {
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
  
  // App data
  userId: null,
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
};

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
        cloudSyncEnabled: !!action.payload,
        profile: action.payload ? {
          ...state.profile,
          displayName: action.payload.displayName || '',
          email: action.payload.email || ''
        } : state.profile
      };
      
    case 'LOGOUT':
      return {
        ...initialState,
        authLoading: false
      };
      
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
      
    case 'INIT_USER':
      return {
        ...state,
        userId: uuidv4(),
        lastVisit: new Date().toISOString()
      };
      
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload }
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
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        // Load user data from cloud
        const cloudData = await loadUserData(user.uid);
        if (cloudData) {
          dispatch({ type: 'LOAD_STATE', payload: cloudData });
        }
      } else {
        dispatch({ type: 'SET_USER', payload: null });
        // Load from localStorage for guests
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            dispatch({ type: 'LOAD_STATE', payload: parsed });
          } catch (e) {
            console.error('Failed to load saved data:', e);
          }
        }
      }
      dispatch({ type: 'INIT_USER' });
    });
    
    return () => unsubscribe();
  }, []);
  
  // Save to localStorage for guests
  useEffect(() => {
    if (!state.isLoggedIn && state.userId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, state.isLoggedIn]);
  
  // Sync to cloud for logged in users
  useEffect(() => {
    if (state.isLoggedIn && state.user && state.cloudSyncEnabled) {
      const syncTimeout = setTimeout(async () => {
        const dataToSave = {
          profile: state.profile,
          wallets: state.wallets,
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
        const success = await saveUserData(state.user.uid, dataToSave);
        if (success) {
          dispatch({ type: 'SET_CLOUD_SYNCED' });
        }
      }, 2000);
      
      return () => clearTimeout(syncTimeout);
    }
  }, [state]);
  
  // Update streak on load
  useEffect(() => {
    if (state.userId && state.lastVisit) {
      dispatch({ type: 'UPDATE_STREAK' });
    }
  }, [state.userId]);
  
  const handleLogout = useCallback(async () => {
    await logOut();
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  
  return (
    <AppContext.Provider value={{ state, dispatch, handleLogout }}>
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
