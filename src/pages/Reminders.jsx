import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Bell, Trash2, Clock, BellRing, BellOff, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reminders() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [form, setForm] = useState({
    title: '',
    time: '',
    repeat: 'daily'
  });
  
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);
  
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };
  
  const handleSubmit = () => {
    if (!form.title || !form.time) return;
    
    dispatch({
      type: 'ADD_REMINDER',
      payload: {
        title: form.title,
        time: form.time,
        repeat: form.repeat,
        enabled: true
      }
    });
    
    dispatch({ type: 'ADD_XP', payload: 5 });
    setForm({ title: '', time: '', repeat: 'daily' });
    setShowForm(false);
  };
  
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_REMINDER', payload: id });
  };
  
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const presetReminders = [
    { title: 'Morning routine check', time: '07:00', icon: '🌅' },
    { title: 'Check portfolio', time: '09:00', icon: '📊' },
    { title: 'Book profits if any', time: '12:00', icon: '💰' },
    { title: 'Review trades', time: '18:00', icon: '📝' },
    { title: 'Daily habit check', time: '21:00', icon: '✅' },
    { title: 'Journal time', time: '22:00', icon: '📖' }
  ];
  
  const addPreset = (preset) => {
    dispatch({
      type: 'ADD_REMINDER',
      payload: {
        title: `${preset.icon} ${preset.title}`,
        time: preset.time,
        repeat: 'daily',
        enabled: true
      }
    });
    dispatch({ type: 'ADD_XP', payload: 5 });
  };
  
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ffd700] to-[#ff6b35] bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Orbitron' }}
          >
            Reminders
          </h1>
          <p className="text-gray-400">
            Stay on track with daily notifications.
          </p>
        </motion.div>
        
        {notificationPermission !== 'granted' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border border-[#ffd700]/30 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ffd700]/20 flex items-center justify-center">
                <BellOff size={24} className="text-[#ffd700]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Enable Notifications</h3>
                <p className="text-sm text-gray-400">
                  Allow notifications to receive reminders at scheduled times.
                </p>
              </div>
              <button
                onClick={requestPermission}
                className="btn-primary"
              >
                Enable
              </button>
            </div>
          </motion.div>
        )}
        
        {notificationPermission === 'granted' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[#39ff14] mb-6"
          >
            <BellRing size={18} />
            <span className="text-sm">Notifications enabled</span>
          </motion.div>
        )}
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Reminder
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Reminder Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Check airdrops"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Repeat</label>
                  <select
                    value={form.repeat}
                    onChange={(e) => setForm({ ...form, repeat: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="once">Once</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={handleSubmit} className="btn-primary flex-1">
                  <Check size={18} className="inline mr-2" />
                  Add Reminder
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {state.reminders.length === 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Bell size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl text-gray-400 mb-2">No reminders yet</h3>
              <p className="text-gray-500 mb-6">
                Set up reminders to stay consistent with your GG mindset
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Add Presets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {presetReminders.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => addPreset(preset)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#39ff14]/30 transition-colors text-left"
                  >
                    <span className="text-2xl">{preset.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-white">{preset.title}</div>
                      <div className="text-sm text-gray-500">{formatTime(preset.time)}</div>
                    </div>
                    <Plus size={18} className="text-gray-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
        
        {state.reminders.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.reminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-xl p-4 border border-[#2a2a3a]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#ffd700]/20 flex items-center justify-center">
                        <Bell size={20} className="text-[#ffd700]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{reminder.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} />
                          {formatTime(reminder.time)}
                          <span className="px-2 py-0.5 rounded bg-[#1a1a24] text-xs capitalize">
                            {reminder.repeat}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-6 border border-[#2a2a3a] mt-8"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Add More Presets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {presetReminders
                  .filter(preset => !state.reminders.some(r => r.title.includes(preset.title)))
                  .map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => addPreset(preset)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#39ff14]/30 transition-colors text-left"
                    >
                      <span className="text-xl">{preset.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{preset.title}</div>
                        <div className="text-xs text-gray-500">{formatTime(preset.time)}</div>
                      </div>
                      <Plus size={16} className="text-gray-500" />
                    </button>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a]"
        >
          <div className="text-sm text-gray-400 mb-2">💡 Pro Tip</div>
          <p className="text-gray-300">
            Consistent daily reminders help build habits. The GG mindset is built through 
            small, repeated actions every single day.
          </p>
        </motion.div>
        
      </div>
    </div>
  );
}
