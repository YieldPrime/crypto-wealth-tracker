import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, Edit2, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useConfetti } from '../hooks/useConfetti';

export default function Goals() {
  const { state, dispatch } = useApp();
  const { fireConfetti } = useConfetti();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    target: '',
    current: '',
    deadline: ''
  });
  
  const handleSubmit = () => {
    if (!form.name || !form.target) return;
    
    if (editingId) {
      dispatch({
        type: 'UPDATE_GOAL',
        payload: {
          id: editingId,
          name: form.name,
          target: parseFloat(form.target),
          current: parseFloat(form.current) || 0,
          deadline: form.deadline
        }
      });
      setEditingId(null);
    } else {
      dispatch({
        type: 'ADD_GOAL',
        payload: {
          name: form.name,
          target: parseFloat(form.target),
          current: parseFloat(form.current) || 0,
          deadline: form.deadline
        }
      });
      dispatch({ type: 'ADD_XP', payload: 15 });
    }
    
    setForm({ name: '', target: '', current: '', deadline: '' });
    setShowForm(false);
  };
  
  const handleEdit = (goal) => {
    setForm({
      name: goal.name,
      target: goal.target.toString(),
      current: goal.current?.toString() || '',
      deadline: goal.deadline || ''
    });
    setEditingId(goal.id);
    setShowForm(true);
  };
  
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };
  
  const handleUpdateCurrent = (goal, newCurrent) => {
    const current = parseFloat(newCurrent) || 0;
    dispatch({
      type: 'UPDATE_GOAL',
      payload: { id: goal.id, current }
    });
    
    if (current >= goal.target && goal.current < goal.target) {
      fireConfetti();
      dispatch({ type: 'ADD_XP', payload: 100 });
    }
  };
  
  const totalTarget = state.goals.reduce((acc, g) => acc + g.target, 0);
  const totalCurrent = state.goals.reduce((acc, g) => acc + (g.current || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget * 100).toFixed(1) : 0;
  
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
            Financial Goals
          </h1>
          <p className="text-gray-400">
            Set targets. Track progress. Achieve greatness.
          </p>
        </motion.div>
        
        {state.goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border border-[#2a2a3a] mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Total Target</div>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron' }}>
                  ${totalTarget.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Current Progress</div>
                <div className="text-2xl font-bold text-[#39ff14]" style={{ fontFamily: 'Orbitron' }}>
                  ${totalCurrent.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Overall</div>
                <div className="text-2xl font-bold text-[#bf00ff]" style={{ fontFamily: 'Orbitron' }}>
                  {overallProgress}%
                </div>
              </div>
            </div>
            <div className="mt-4 h-3 bg-[#1a1a24] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#39ff14] to-[#bf00ff]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm({ name: '', target: '', current: '', deadline: '' });
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Goal
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
              <h3 className="text-lg font-bold text-white mb-4">
                {editingId ? 'Edit Goal' : 'New Goal'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Goal Name</label>
                  <input
                    type="text"
                    placeholder="e.g., First $10,000"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Target Amount ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 10000"
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Progress ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 2500"
                    value={form.current}
                    onChange={(e) => setForm({ ...form, current: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Deadline (optional)</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={handleSubmit} className="btn-primary flex-1">
                  <Check size={18} className="inline mr-2" />
                  {editingId ? 'Update Goal' : 'Create Goal'}
                </button>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="btn-secondary"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="space-y-4">
          {state.goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Target size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl text-gray-400 mb-2">No goals yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first financial goal to start tracking
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                <Plus size={18} className="inline mr-2" />
                Add Your First Goal
              </button>
            </motion.div>
          ) : (
            state.goals.map((goal, index) => {
              const progress = goal.target > 0 
                ? ((goal.current || 0) / goal.target * 100).toFixed(1) 
                : 0;
              const isCompleted = (goal.current || 0) >= goal.target;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card rounded-2xl p-6 border ${
                    isCompleted 
                      ? 'border-[#39ff14]/50 bg-[#39ff14]/5' 
                      : 'border-[#2a2a3a]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <div className="w-12 h-12 rounded-xl bg-[#39ff14] flex items-center justify-center">
                          <Check size={24} className="text-black" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#1a1a24] flex items-center justify-center">
                          <Target size={24} className="text-[#bf00ff]" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white">{goal.name}</h3>
                        {goal.deadline && (
                          <p className="text-sm text-gray-500">
                            Deadline: {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-gray-500 hover:text-[#39ff14] transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Target</div>
                      <div className="text-xl font-bold text-white">
                        ${goal.target.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Current</div>
                      <div className="text-xl font-bold text-[#39ff14]">
                        ${(goal.current || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Remaining</div>
                      <div className="text-xl font-bold text-[#bf00ff]">
                        ${Math.max(0, goal.target - (goal.current || 0)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm font-bold" style={{ 
                        color: isCompleted ? '#39ff14' : '#bf00ff' 
                      }}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-3 bg-[#1a1a24] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          isCompleted 
                            ? 'bg-[#39ff14]' 
                            : 'bg-gradient-to-r from-[#bf00ff] to-[#39ff14]'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Update current amount"
                        className="flex-1"
                        defaultValue={goal.current || ''}
                        onBlur={(e) => handleUpdateCurrent(goal, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateCurrent(goal, e.target.value);
                          }
                        }}
                      />
                      <button className="btn-secondary text-sm">
                        Update
                      </button>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="p-3 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/30 text-center">
                      <span className="text-[#39ff14] font-semibold">
                        🎉 Goal Achieved! +100 XP
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
        
      </div>
    </div>
  );
}
