import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

const STORAGE_KEY = 'gg-mindset-vault-data';

const initialState = {
  userId: null,
  isGuest: true,
  walletAddress: null,
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
  completedCelebration: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
      
    case 'INIT_USER':
      return {
        ...state,
        userId: uuidv4(),
        lastVisit: new Date().toISOString()
      };
      
    case 'CONNECT_WALLET':
      return {
        ...state,
        walletAddress: action.payload,
        isGuest: false
      };
      
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        walletAddress: null,
        isGuest: true
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
  
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    } else {
      dispatch({ type: 'INIT_USER' });
    }
  }, []);
  
  useEffect(() => {
    if (state.userId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);
  
  useEffect(() => {
    if (state.userId && state.lastVisit) {
      dispatch({ type: 'UPDATE_STREAK' });
    }
  }, [state.userId]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
