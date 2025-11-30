import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Check, Lock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { guideData, calculateProgress } from '../data/guideData';
import { useConfetti } from '../hooks/useConfetti';

export default function Chapters() {
  const { state, dispatch } = useApp();
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const { fireConfetti } = useConfetti();
  
  const handleCheckbox = (chapterId, sectionId, field, currentValue) => {
    const newValue = !currentValue;
    
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: { chapterId, sectionId, field, value: newValue }
    });
    
    if (newValue) {
      const chapterProgress = state.progress[chapterId] || {};
      const sectionProgress = chapterProgress[sectionId] || { understood: false, implemented: false };
      
      const otherField = field === 'understood' ? 'implemented' : 'understood';
      const otherValue = sectionProgress[otherField];
      
      if (otherValue) {
        fireConfetti();
        dispatch({ type: 'ADD_XP', payload: 25 });
      } else {
        dispatch({ type: 'ADD_XP', payload: 10 });
      }
    }
  };
  
  const getChapterProgress = (chapterId, sections) => {
    const chapterProgress = state.progress[chapterId] || {};
    const totalItems = sections.length * 2;
    let completed = 0;
    
    Object.values(chapterProgress).forEach(section => {
      if (section.understood) completed++;
      if (section.implemented) completed++;
    });
    
    return Math.round((completed / totalItems) * 100);
  };
  
  const getSectionStatus = (chapterId, sectionId) => {
    const chapterProgress = state.progress[chapterId] || {};
    const sectionProgress = chapterProgress[sectionId] || { understood: false, implemented: false };
    return sectionProgress;
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
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#39ff14] to-[#bf00ff] bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Orbitron' }}
          >
            The GG Mindset Journey
          </h1>
          <p className="text-gray-400">
            7 Levels • {calculateProgress(state.progress)}% Complete
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {guideData.chapters.map((chapter, chapterIndex) => {
            const isExpanded = expandedChapter === chapter.id;
            const progress = getChapterProgress(chapter.id, chapter.sections);
            const isCompleted = progress === 100;
            
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: chapterIndex * 0.1 }}
                className="glass-card rounded-2xl border border-[#2a2a3a] overflow-hidden"
              >
                
                <button
                  onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                  className="w-full p-4 md:p-6 flex items-center gap-4 text-left hover:bg-[#1a1a24]/50 transition-colors"
                >
                  <div 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      isCompleted ? 'animate-pulse-glow' : ''
                    }`}
                    style={{ 
                      background: `${chapter.color}20`,
                      border: `2px solid ${chapter.color}`
                    }}
                  >
                    {isCompleted ? '✓' : chapter.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ background: `${chapter.color}30`, color: chapter.color }}
                      >
                        LEVEL {chapter.id}
                      </span>
                      {isCompleted && (
                        <Sparkles size={16} className="text-[#ffd700]" />
                      )}
                    </div>
                    <h3 className="font-bold text-white text-lg truncate">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-gray-500 hidden md:block">
                      {chapter.description}
                    </p>
                    
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-[#1a1a24] rounded-full overflow-hidden max-w-[200px]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: chapter.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-gray-500"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-[#2a2a3a]"
                    >
                      <div className="p-4 md:p-6 space-y-4">
                        {chapter.sections.map((section, sectionIndex) => {
                          const status = getSectionStatus(chapter.id, section.id);
                          const isSectionExpanded = expandedSection === section.id;
                          const isSectionCompleted = status.understood && status.implemented;
                          
                          return (
                            <motion.div
                              key={section.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: sectionIndex * 0.05 }}
                              className={`rounded-xl border ${
                                isSectionCompleted 
                                  ? 'border-[#39ff14]/50 bg-[#39ff14]/5' 
                                  : 'border-[#2a2a3a] bg-[#1a1a24]'
                              }`}
                            >
                              
                              <button
                                onClick={() => setExpandedSection(isSectionExpanded ? null : section.id)}
                                className="w-full p-4 flex items-center gap-3 text-left"
                              >
                                <div 
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isSectionCompleted 
                                      ? 'bg-[#39ff14] text-black' 
                                      : 'bg-[#2a2a3a] text-gray-500'
                                  }`}
                                >
                                  {isSectionCompleted ? (
                                    <Check size={16} />
                                  ) : (
                                    <span className="text-sm font-bold">{sectionIndex + 1}</span>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white">{section.title}</h4>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {status.understood && (
                                    <span className="text-xs px-2 py-1 rounded bg-[#39ff14]/20 text-[#39ff14]">
                                      ✓ Understood
                                    </span>
                                  )}
                                  {status.implemented && (
                                    <span className="text-xs px-2 py-1 rounded bg-[#bf00ff]/20 text-[#bf00ff]">
                                      ✓ Implemented
                                    </span>
                                  )}
                                  <ChevronRight 
                                    size={18} 
                                    className={`text-gray-500 transition-transform ${
                                      isSectionExpanded ? 'rotate-90' : ''
                                    }`}
                                  />
                                </div>
                              </button>
                              
                              <AnimatePresence>
                                {isSectionExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-[#2a2a3a]"
                                  >
                                    <div className="p-4 space-y-4">
                                      <p className="text-gray-300 leading-relaxed">
                                        {section.content}
                                      </p>
                                      
                                      {section.tips && section.tips.length > 0 && (
                                        <div className="space-y-2">
                                          <h5 className="text-sm font-semibold text-gray-400">Key Points:</h5>
                                          <ul className="space-y-1">
                                            {section.tips.map((tip, tipIndex) => (
                                              <li 
                                                key={tipIndex}
                                                className="text-sm text-gray-400 flex items-start gap-2"
                                              >
                                                <span style={{ color: chapter.color }}>•</span>
                                                {tip}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      <div className="pt-4 border-t border-[#2a2a3a] space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                          <input
                                            type="checkbox"
                                            checked={status.understood}
                                            onChange={() => handleCheckbox(
                                              chapter.id, 
                                              section.id, 
                                              'understood', 
                                              status.understood
                                            )}
                                          />
                                          <span className="text-gray-300 group-hover:text-white transition-colors">
                                            I understand this concept
                                          </span>
                                          <span className="text-xs text-[#39ff14]">+10 XP</span>
                                        </label>
                                        
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                          <input
                                            type="checkbox"
                                            checked={status.implemented}
                                            onChange={() => handleCheckbox(
                                              chapter.id, 
                                              section.id, 
                                              'implemented', 
                                              status.implemented
                                            )}
                                          />
                                          <span className="text-gray-300 group-hover:text-white transition-colors">
                                            I have implemented this in my life
                                          </span>
                                          <span className="text-xs text-[#bf00ff]">+10 XP</span>
                                        </label>
                                        
                                        {status.understood && status.implemented && (
                                          <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-3 rounded-lg bg-gradient-to-r from-[#39ff14]/10 to-[#bf00ff]/10 border border-[#39ff14]/20 text-center"
                                          >
                                            <span className="text-[#39ff14] font-semibold">
                                              🎉 Section Complete! +25 XP Bonus
                                            </span>
                                          </motion.div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                        
                        {progress === 100 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-gradient-to-r from-[#39ff14]/20 to-[#bf00ff]/20 border border-[#39ff14]/30 text-center"
                          >
                            <span className="text-2xl">🏆</span>
                            <p className="font-bold text-white mt-2">
                              Level {chapter.id} Complete!
                            </p>
                            <p className="text-sm text-gray-400">
                              You've mastered {chapter.title}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
