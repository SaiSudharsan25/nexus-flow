"use client";

import React, { useState, useEffect } from 'react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onSave: (updatedTask: any) => void;
}

export default function TaskModal({ isOpen, onClose, task, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setTag(task.tag || 'Marketing');
    }
  }, [task]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl shadow-black/20 overflow-hidden border border-gray-100 animate-fade-in">
        <div className="h-2 w-full bg-primary"></div>
        
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Edit Task Details</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Workspace / {task?.status || 'General'}</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Task Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/30 text-base font-bold transition-all outline-none"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-5 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/30 text-sm font-medium leading-relaxed transition-all outline-none resize-none"
                placeholder="Add more details about this task..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Label</label>
                <select 
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border-transparent text-xs font-bold uppercase tracking-wider outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="Marketing">Marketing</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Review">Review</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full h-12 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-blue-100 transition-all border border-blue-100">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                  <span>Attach from Drive</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex space-x-4">
            <button 
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave({ ...task, title, description, tag })}
              className="flex-1 h-14 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
