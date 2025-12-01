import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  PieChart, 
  Wallet, 
  TrendingUp,
  Plus,
  Trash2,
  Check,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { guideData } from '../data/guideData';
import { useConfetti } from '../hooks/useConfetti';

function ProfitCalculator() {
  const { dispatch } = useApp();
  const { fireConfetti } = useConfetti();
  const [form, setForm] = useState({
    tokenName: '',
    amountReceived: '',
    priceAtReceive: ''
  });
  const [result, setResult] = useState(null);
  
  const calculate = () => {
    const amount = parseFloat(form.amountReceived) || 0;
    const price = parseFloat(form.priceAtReceive) || 0;
    const totalValue = amount * price;
    
    const firstSell = totalValue * 0.8;
    const remaining = totalValue * 0.2;
    
    const sell2x = remaining * 0.5;
    const afterSell2x = remaining * 0.5;
    
    const sell3x = afterSell2x * 0.5;
    const moonbag = afterSell2x * 0.5;
    
    setResult({
      totalValue,
      firstSell,
      sell2x,
      sell3x,
      moonbag
    });
  };
  
  const bookProfit = (stage, amount) => {
    dispatch({
      type: 'ADD_PROFIT_BOOKING',
      payload: {
        tokenName: form.tokenName,
        stage,
        usdtAmount: amount
      }
    });
    fireConfetti();
    dispatch({ type: 'ADD_XP', payload: 50 });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Token Name</label>
          <input
            type="text"
            placeholder="e.g., AIRDROP"
            value={form.tokenName}
            onChange={(e) => setForm({ ...form, tokenName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Amount Received</label>
          <input
            type="number"
            placeholder="e.g., 1000"
            value={form.amountReceived}
            onChange={(e) => setForm({ ...form, amountReceived: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Price at Receive ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 1.50"
            value={form.priceAtReceive}
            onChange={(e) => setForm({ ...form, priceAtReceive: e.target.value })}
          />
        </div>
      </div>
      
      <button onClick={calculate} className="btn-primary w-full">
        Calculate Profit Strategy
      </button>
      
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a]">
            <div className="text-sm text-gray-400 mb-1">Total Value at Receive</div>
            <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>
              ${result.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#39ff14]/10 to-transparent border border-[#39ff14]/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-400">Step 1: Sell 80%</div>
                  <div className="text-xl font-bold text-[#39ff14]">
                    ${result.firstSell.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <button
                  onClick={() => bookProfit('80% First Sell', result.firstSell)}
                  className="btn-primary text-sm py-2 px-3"
                >
                  <Check size={16} className="inline mr-1" />
                  Booked
                </button>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#00bfff]/10 to-transparent border border-[#00bfff]/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-400">Step 2: Sell 50% at 2x</div>
                  <div className="text-xl font-bold text-[#00bfff]">
                    ${result.sell2x.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <button
                  onClick={() => bookProfit('50% at 2x', result.sell2x)}
                  className="btn-secondary text-sm py-2 px-3"
                >
                  <Check size={16} className="inline mr-1" />
                  Booked
                </button>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#bf00ff]/10 to-transparent border border-[#bf00ff]/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-400">Step 3: Sell 50% at 3x</div>
                  <div className="text-xl font-bold text-[#bf00ff]">
                    ${result.sell3x.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <button
                  onClick={() => bookProfit('50% at 3x', result.sell3x)}
                  className="btn-secondary text-sm py-2 px-3"
                >
                  <Check size={16} className="inline mr-1" />
                  Booked
                </button>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#ffd700]/10 to-transparent border border-[#ffd700]/30">
              <div>
                <div className="text-sm text-gray-400">Moonbag (Hold for 🚀)</div>
                <div className="text-xl font-bold text-[#ffd700]">
                  ${result.moonbag.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500 mt-1">Let it ride or HODL forever</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PortfolioTracker() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({
    ledger: state.portfolioAllocation.ledger || '',
    hotWallet: state.portfolioAllocation.hotWallet || '',
    bank: state.portfolioAllocation.bank || '',
    exchange: state.portfolioAllocation.exchange || ''
  });
  
  const handleSave = () => {
    dispatch({
      type: 'UPDATE_PORTFOLIO',
      payload: {
        ledger: parseFloat(form.ledger) || 0,
        hotWallet: parseFloat(form.hotWallet) || 0,
        bank: parseFloat(form.bank) || 0,
        exchange: parseFloat(form.exchange) || 0
      }
    });
  };
  
  const total = (parseFloat(form.ledger) || 0) + 
                (parseFloat(form.hotWallet) || 0) + 
                (parseFloat(form.bank) || 0) + 
                (parseFloat(form.exchange) || 0);
  
  const getPercentage = (value) => {
    if (total === 0) return 0;
    return ((parseFloat(value) || 0) / total * 100).toFixed(1);
  };
  
  const allocations = [
    { key: 'ledger', label: 'Ledger (Cold Storage)', target: 40, color: '#39ff14' },
    { key: 'hotWallet', label: 'Hot Wallet', target: 15, color: '#bf00ff' },
    { key: 'bank', label: 'Bank Account', target: 25, color: '#ffd700' },
    { key: 'exchange', label: 'Exchange', target: 20, color: '#00bfff' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-center">
        <div className="text-sm text-gray-400 mb-1">Total Portfolio Value</div>
        <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>
          ${total.toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allocations.map((item) => (
          <div key={item.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">{item.label}</label>
              <span className="text-xs" style={{ color: item.color }}>
                Target: {item.target}% | Current: {getPercentage(form[item.key])}%
              </span>
            </div>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="number"
                placeholder="0"
                value={form[item.key]}
                onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
                className="pl-8"
              />
            </div>
            <div className="h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${Math.min(getPercentage(form[item.key]), 100)}%`,
                  background: item.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={handleSave} className="btn-primary w-full">
        Save Portfolio Allocation
      </button>
    </div>
  );
}

function BankBackupTracker() {
  const { state, dispatch } = useApp();
  const [balance, setBalance] = useState(state.bankBackupBalance || '');
  const [target, setTarget] = useState(state.bankBackupTarget || 500000);
  
  const handleSave = () => {
    dispatch({
      type: 'UPDATE_BANK_BACKUP',
      payload: {
        balance: parseFloat(balance) || 0,
        target: parseFloat(target) || 500000
      }
    });
  };
  
  const percentage = target > 0 ? ((parseFloat(balance) || 0) / target * 100).toFixed(1) : 0;
  
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#ffd700]/10 to-[#ff6b35]/10 border border-[#ffd700]/30">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-400 mb-1">Emergency Fund Progress</div>
          <div className="text-4xl font-bold text-[#ffd700]" style={{ fontFamily: 'Orbitron' }}>
            {percentage}%
          </div>
        </div>
        <div className="h-4 bg-[#1a1a24] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#ffd700] to-[#ff6b35]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Current Balance (₹)</label>
          <input
            type="number"
            placeholder="e.g., 200000"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Target Amount (₹)</label>
          <input
            type="number"
            placeholder="e.g., 500000"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      </div>
      
      <button onClick={handleSave} className="btn-primary w-full">
        Update Bank Backup
      </button>
      
      <div className="p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a]">
        <div className="text-sm text-gray-400 mb-2">💡 Recommended Target</div>
        <p className="text-gray-300">
          Keep ₹2-5 lakh ($2,500-$6,000) as untouchable emergency fund. 
          This should cover 6+ months of expenses.
        </p>
      </div>
    </div>
  );
}

function HabitTracker() {
  const { state, dispatch } = useApp();
  const { fireConfetti } = useConfetti();
  const today = new Date().toDateString();
  const todayLog = state.habitLog[today] || [];
  
  const toggleHabit = (habitId) => {
    dispatch({ type: 'LOG_HABIT', payload: habitId });
    
    if (!todayLog.includes(habitId)) {
      dispatch({ type: 'ADD_XP', payload: 5 });
      
      if (todayLog.length + 1 === guideData.habits.length) {
        fireConfetti();
        dispatch({ type: 'ADD_XP', payload: 50 });
      }
    }
  };
  
  const completedCount = todayLog.length;
  const totalHabits = guideData.habits.length;
  
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-center">
        <div className="text-sm text-gray-400 mb-1">Today's Progress</div>
        <div className="text-3xl font-bold text-[#39ff14]" style={{ fontFamily: 'Orbitron' }}>
          {completedCount} / {totalHabits}
        </div>
        <div className="h-2 bg-[#2a2a3a] rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#39ff14] to-[#00ff88]"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalHabits) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        {guideData.habits.map((habit) => {
          const isCompleted = todayLog.includes(habit.id);
          
          return (
            <motion.button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 text-left ${
                isCompleted 
                  ? 'border-[#39ff14]/50 bg-[#39ff14]/10' 
                  : 'border-[#2a2a3a] bg-[#1a1a24] hover:border-[#39ff14]/30'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isCompleted ? 'bg-[#39ff14] border-[#39ff14]' : 'border-gray-500'
              }`}>
                {isCompleted && <Check size={14} className="text-black" />}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${isCompleted ? 'text-[#39ff14]' : 'text-white'}`}>
                  {habit.name}
                </div>
                <div className="text-sm text-gray-500">{habit.description}</div>
              </div>
              <span className="text-xs text-[#39ff14]">+5 XP</span>
            </motion.button>
          );
        })}
      </div>
      
      {completedCount === totalHabits && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-[#39ff14]/20 to-[#bf00ff]/20 border border-[#39ff14]/30 text-center"
        >
          <span className="text-2xl">🏆</span>
          <p className="font-bold text-white mt-2">All Habits Complete!</p>
          <p className="text-sm text-gray-400">+50 XP Bonus earned</p>
        </motion.div>
      )}
    </div>
  );
}

function MonthlyIncomeTracker() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({
    month: '',
    amount: '',
    notes: ''
  });
  
  const handleAdd = () => {
    if (!form.month || !form.amount) return;
    
    dispatch({
      type: 'ADD_MONTHLY_INCOME',
      payload: {
        month: form.month,
        amount: parseFloat(form.amount),
        notes: form.notes
      }
    });
    
    setForm({ month: '', amount: '', notes: '' });
  };
  
  const totalIncome = state.monthlyIncome.reduce((acc, item) => acc + item.amount, 0);
  
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-center">
        <div className="text-sm text-gray-400 mb-1">Total Tracked Income</div>
        <div className="text-3xl font-bold text-[#39ff14]" style={{ fontFamily: 'Orbitron' }}>
          ${totalIncome.toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Month</label>
          <input
            type="month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Amount ($)</label>
          <input
            type="number"
            placeholder="e.g., 5000"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Notes</label>
          <input
            type="text"
            placeholder="e.g., Airdrops + Trading"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </div>
      
      <button onClick={handleAdd} className="btn-primary w-full">
        <Plus size={18} className="inline mr-2" />
        Add Income Entry
      </button>
      
      {state.monthlyIncome.length > 0 && (
        <div className="rounded-xl border border-[#2a2a3a] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1a1a24]">
              <tr>
                <th className="text-left p-3 text-sm text-gray-400">Month</th>
                <th className="text-right p-3 text-sm text-gray-400">Amount</th>
                <th className="text-left p-3 text-sm text-gray-400">Notes</th>
              </tr>
            </thead>
            <tbody>
              {state.monthlyIncome.map((item) => (
                <tr key={item.id} className="border-t border-[#2a2a3a]">
                  <td className="p-3 text-white">{item.month}</td>
                  <td className="p-3 text-right text-[#39ff14] font-mono">
                    ${item.amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-gray-400">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProfitBookingHistory() {
  const { state } = useApp();
  
  const totalBooked = state.profitBookings.reduce((acc, b) => acc + (b.usdtAmount || 0), 0);
  
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#39ff14]/10 to-[#bf00ff]/10 border border-[#39ff14]/30 text-center">
        <div className="text-sm text-gray-400 mb-1">Total Profit Booked</div>
        <div className="text-3xl font-bold text-[#39ff14]" style={{ fontFamily: 'Orbitron' }}>
          ${totalBooked.toLocaleString()}
        </div>
      </div>
      
      {state.profitBookings.length > 0 ? (
        <div className="rounded-xl border border-[#2a2a3a] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1a1a24]">
              <tr>
                <th className="text-left p-3 text-sm text-gray-400">Date</th>
                <th className="text-left p-3 text-sm text-gray-400">Token</th>
                <th className="text-left p-3 text-sm text-gray-400">Stage</th>
                <th className="text-right p-3 text-sm text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              {state.profitBookings.slice().reverse().map((booking) => (
                <tr key={booking.id} className="border-t border-[#2a2a3a]">
                  <td className="p-3 text-gray-400">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-white font-medium">{booking.tokenName}</td>
                  <td className="p-3 text-gray-400">{booking.stage}</td>
                  <td className="p-3 text-right text-[#39ff14] font-mono">
                    ${booking.usdtAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No profits booked yet. Use the calculator above to start!
        </div>
      )}
    </div>
  );
}

export default function Tools() {
  const [activeTab, setActiveTab] = useState('profit');
  
  const tabs = [
    { id: 'profit', label: 'Profit Calculator', icon: Calculator },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'bank', label: 'Bank Backup', icon: Wallet },
    { id: 'habits', label: 'Habits', icon: Check },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'history', label: 'History', icon: DollarSign }
  ];
  
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#39ff14] to-[#bf00ff] bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Orbitron' }}
          >
            Tools & Trackers
          </h1>
          <p className="text-gray-400">
            Everything you need to implement the GG Mindset
          </p>
        </motion.div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#39ff14] text-black'
                  : 'bg-[#1a1a24] text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
        >
          {activeTab === 'profit' && <ProfitCalculator />}
          {activeTab === 'portfolio' && <PortfolioTracker />}
          {activeTab === 'bank' && <BankBackupTracker />}
          {activeTab === 'habits' && <HabitTracker />}
          {activeTab === 'income' && <MonthlyIncomeTracker />}
          {activeTab === 'history' && <ProfitBookingHistory />}
        </motion.div>
        
      </div>
    </div>
  );
}
