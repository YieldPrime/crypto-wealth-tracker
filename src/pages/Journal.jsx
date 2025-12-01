import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PenTool, Trash2, Edit2, Save, X, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Journal() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  
  const handleSubmit = () => {
    if (!content.trim()) return;
    
    if (editingId) {
      dispatch({
        type: 'UPDATE_JOURNAL_ENTRY',
        payload: {
          id: editingId,
          title: title.trim() || 'Untitled',
          content: content.trim()
        }
      });
      setEditingId(null);
    } else {
      dispatch({
        type: 'ADD_JOURNAL_ENTRY',
        payload: {
          title: title.trim() || 'Untitled',
          content: content.trim()
        }
      });
      dispatch({ type: 'ADD_XP', payload: 10 });
    }
    
    setContent('');
    setTitle('');
    setShowForm(false);
  };
  
  const handleEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setEditingId(entry.id);
    setShowForm(true);
  };
  
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_JOURNAL_ENTRY', payload: id });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#bf00ff] to-[#00bfff] bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Orbitron' }}
          >
            My Journal
          </h1>
          <p className="text-gray-400">
            Document your thoughts, lessons, and wins.
          </p>
        </motion.div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-500">
            {state.journalEntries.length} {state.journalEntries.length === 1 ? 'entry' : 'entries'}
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setTitle('');
              setContent('');
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Entry
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Today's Lesson"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your thoughts</label>
                  <textarea
                    rows={8}
                    placeholder="Write about your day, lessons learned, trades made, goals achieved..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button onClick={handleSubmit} className="btn-primary flex-1">
                    <Save size={18} className="inline mr-2" />
                    {editingId ? 'Update Entry' : 'Save Entry'}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {state.journalEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <PenTool size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No journal entries yet</h3>
            <p className="text-gray-500 mb-4">
              Start documenting your journey, lessons, and wins
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={18} className="inline mr-2" />
              Write Your First Entry
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {state.journalEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-6 border border-[#2a2a3a]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{entry.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {formatDate(entry.date)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-gray-500 hover:text-[#39ff14] transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a3a]"
        >
          <div className="text-sm text-gray-400 mb-2">💡 Journaling Tips</div>
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>• Document every trade and the reasoning behind it</li>
            <li>• Write down what you learned from losses</li>
            <li>• Track your emotional state during decisions</li>
            <li>• Celebrate your wins, no matter how small</li>
          </ul>
        </motion.div>
        
      </div>
    </div>
  );
}
