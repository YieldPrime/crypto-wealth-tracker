import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Gift, Trash2, Check, X, Heart, ShoppingBag, Plane, Car, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useConfetti } from '../hooks/useConfetti';

const categoryIcons = {
  gadget: ShoppingBag,
  travel: Plane,
  vehicle: Car,
  home: Home,
  gift: Gift,
  other: Heart
};

const categoryColors = {
  gadget: '#00bfff',
  travel: '#39ff14',
  vehicle: '#ff6b35',
  home: '#bf00ff',
  gift: '#ffd700',
  other: '#e91e63'
};

export default function Dreams() {
  const { state, dispatch } = useApp();
  const { fireConfetti } = useConfetti();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'gadget',
    notes: ''
  });
  
  const handleSubmit = () => {
    if (!form.name || !form.price) return;
    
    dispatch({
      type: 'ADD_DREAM',
      payload: {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        notes: form.notes
      }
    });
    
    dispatch({ type: 'ADD_XP', payload: 10 });
    setForm({ name: '', price: '', category: 'gadget', notes: '' });
    setShowForm(false);
  };
  
  const handleFund = (dream) => {
    dispatch({
      type: 'UPDATE_DREAM',
      payload: { id: dream.id, funded: !dream.funded }
    });
    
    if (!dream.funded) {
      fireConfetti();
      dispatch({ type: 'ADD_XP', payload: 25 });
    }
  };
  
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_DREAM', payload: id });
  };
  
  const totalDreams = state.dreamList.length;
  const fundedDreams = state.dreamList.filter(d => d.funded).length;
  const totalValue = state.dreamList.reduce((acc, d) => acc + d.price, 0);
  const fundedValue = state.dreamList.filter(d => d.funded).reduce((acc, d) => acc + d.price, 0);
  
  const groupedDreams = state.dreamList.reduce((acc, dream) => {
    const category = dream.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(dream);
    return acc;
  }, {});
  
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ff6b35] to-[#ffd700] bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Orbitron' }}
          >
            Dream List
          </h1>
          <p className="text-gray-400">
            Reward yourself. You earned it.
          </p>
        </motion.div>
        
        {state.dreamList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border border-[#2a2a3a] mb-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Total Dreams</div>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>
                  {totalDreams}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Funded</div>
                <div className="text-2xl font-bold text-[#39ff14]" style={{ fontFamily: 'Orbitron' }}>
                  {fundedDreams}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Total Value</div>
                <div className="text-2xl font-bold text-[#ffd700]" style={{ fontFamily: 'Orbitron' }}>
                  ${totalValue.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Funded Value</div>
                <div className="text-2xl font-bold text-[#39ff14]" style={{ fontFamily: 'Orbitron' }}>
                  ${fundedValue.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Dream
          </button>
        </div>
        
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-2xl p-6 border border-[#2a2a3a] mb-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Add New Dream</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">What do you want?</label>
                  <input
                    type="text"
                    placeholder="e.g., MacBook Pro M3"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 2500"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="gadget">Gadget / Tech</option>
                    <option value="travel">Travel / Experience</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="home">Home / Property</option>
                    <option value="gift">Gift for Family</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., For video editing"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={handleSubmit} className="btn-primary flex-1">
                  <Check size={18} className="inline mr-2" />
                  Add to Dream List
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {state.dreamList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Gift size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No dreams yet</h3>
            <p className="text-gray-500 mb-4">
              Add things you want to buy or experiences you want to have
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={18} className="inline mr-2" />
              Add Your First Dream
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedDreams).map(([category, dreams]) => {
              const IconComponent = categoryIcons[category] || Gift;
              const color = categoryColors[category] || '#888';
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${color}20` }}
                    >
                      <IconComponent size={20} style={{ color }} />
                    </div>
                    <h3 
                      className="text-lg font-bold capitalize"
                      style={{ color }}
                    >
                      {category === 'gadget' ? 'Gadgets & Tech' : 
                       category === 'gift' ? 'Gifts for Family' : 
                       category}
                    </h3>
                    <span className="text-gray-500 text-sm">
                      ({dreams.length} items)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dreams.map((dream, index) => (
                      <motion.div
                        key={dream.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`glass-card rounded-xl p-4 border ${
                          dream.funded 
                            ? 'border-[#39ff14]/50 bg-[#39ff14]/5' 
                            : 'border-[#2a2a3a]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className={`font-bold ${
                              dream.funded ? 'text-[#39ff14]' : 'text-white'
                            }`}>
                              {dream.name}
                            </h4>
                            {dream.notes && (
                              <p className="text-sm text-gray-500">{dream.notes}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(dream.id)}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div 
                            className="text-xl font-bold"
                            style={{ color, fontFamily: 'Orbitron' }}
                          >
                            ${dream.price.toLocaleString()}
                          </div>
                          
                          <button
                            onClick={() => handleFund(dream)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                              dream.funded
                                ? 'bg-[#39ff14] text-black'
                                : 'bg-[#1a1a24] text-gray-400 hover:bg-[#2a2a3a] hover:text-white'
                            }`}
                          >
                            {dream.funded ? (
                              <>
                                <Check size={16} className="inline mr-1" />
                                Funded!
                              </>
                            ) : (
                              'Mark as Funded'
                            )}
                          </button>
                        </div>
                        
                        {dream.funded && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 text-center text-sm text-[#39ff14]"
                          >
                            🎉 You made it happen!
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a]"
        >
          <div className="text-sm text-gray-400 mb-2">💡 Remember</div>
          <p className="text-gray-300">
            Balance is key. Reward yourself for hitting targets, but stay disciplined. 
            A dream funded from profits hits different than one bought on credit.
          </p>
        </motion.div>
        
      </div>
    </div>
  );
}
