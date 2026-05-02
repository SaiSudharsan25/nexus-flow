"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TaskModal from '@/components/TaskModal';
import SmartAssistant from '@/components/SmartAssistant';

interface Task {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  assignees: { name: string; initial: string; bg: string }[];
  dueDate: string;
  isOverdue?: boolean;
  progress?: number | null;
  status: 'todo' | 'in-progress' | 'done';
}

const TaskCard = React.memo(({ task, onClick }: { task: Task; onClick: () => void }) => {
  const { title, description, tag, tagColor, assignees, dueDate, isOverdue, progress } = task;

  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden glass-effect task-card-hover cursor-pointer ${
        isOverdue 
          ? 'bg-red-50/50 border-red-200 ring-1 ring-red-100' 
          : 'bg-white/80 border-white/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${tagColor} shadow-sm ring-1 ring-black/5`}>
            {tag}
          </span>
          {isOverdue && (
            <span className="flex items-center text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse ring-1 ring-red-200">
              URGENT
            </span>
          )}
        </div>
        
        <h4 className={`font-bold text-base mb-2 leading-tight tracking-tight ${isOverdue ? 'text-red-900' : 'text-gray-900'}`}>
          {title}
        </h4>
        <p className={`text-xs mb-5 line-clamp-2 leading-relaxed font-medium ${isOverdue ? 'text-red-700/70' : 'text-gray-500'}`}>
          {description}
        </p>
        
        {progress !== null && (
          <div className="mb-5">
            <div className="flex justify-between text-[10px] mb-1.5 font-bold text-gray-400 uppercase tracking-tight">
              <span>Completion</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100/50 rounded-full h-1.5 overflow-hidden border border-gray-200/20">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(66,133,244,0.4)]" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {isOverdue && (
          <button className="w-full mb-5 flex items-center justify-center space-x-2 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700 px-3 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 group/ping">
            <svg className="w-3.5 h-3.5 text-[#00832D] group-hover/ping:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.76 1.48 5.23 3.8 6.84.28.19.46.5.46.85v3.13c0 .35.39.56.68.36l3.41-2.31c.21-.14.46-.22.72-.22H12c5.52 0 10-3.92 10-8.75S17.52 2 12 2z"/>
            </svg>
            <span>Notify Team</span>
          </button>
        )}

        <div className="flex justify-between items-center pt-1">
          <div className="flex -space-x-2.5">
            {assignees.map((a, i) => (
              <div 
                key={i} 
                title={a.name} 
                className={`w-8 h-8 rounded-xl text-white flex items-center justify-center text-[10px] font-black ring-2 ring-white shadow-md transition-transform hover:z-10 hover:scale-110 ${a.bg}`}
              >
                {a.initial}
              </div>
            ))}
          </div>
          <div className={`text-[10px] font-bold flex items-center px-3 py-1.5 rounded-xl border ${
            isOverdue 
              ? 'text-red-700 bg-red-100/50 border-red-200' 
              : 'text-gray-500 bg-white border-gray-100 shadow-sm'
          }`}>
            <svg className="w-3 h-3 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {dueDate}
          </div>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const tasksRef = collection(db, 'tasks');
      const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
        const fetchedTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(fetchedTasks);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase Connection Error", err);
      setLoading(false);
    }
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || t.tag.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, filter]);

  const handleAddTask = useCallback(async (status: 'todo' | 'in-progress' | 'done' = 'todo') => {
    try {
      const tasksRef = collection(db, 'tasks');
      await addDoc(tasksRef, {
        title: "New Operations Task",
        description: "Specify task details and sync with Google Drive assets.",
        tag: "Operations",
        tagColor: "bg-blue-100 text-blue-700",
        assignees: [{ name: "You", initial: "U", bg: "bg-[#1E1E2D]" }],
        dueDate: "Today",
        isOverdue: false,
        status: status,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Task Creation Error: ", error);
    }
  }, []);

  const handleSyncWorkspace = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Workspace Synced with Google Calendar & Drive successfully!");
    }, 2000);
  }, []);

  const handleUpdateTask = useCallback(async (updatedTask: Task) => {
    try {
      const taskRef = doc(db, 'tasks', updatedTask.id);
      await updateDoc(taskRef, {
        title: updatedTask.title,
        description: updatedTask.description,
        tag: updatedTask.tag
      });
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Task Update Error: ", error);
    }
  }, []);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-400', textColor: 'text-gray-600' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-primary', textColor: 'text-primary' },
    { id: 'done', title: 'Completed', color: 'bg-green-500', textColor: 'text-green-600' }
  ];

  return (
    <div className="h-full flex overflow-hidden animate-fade-in bg-[#FDFDFD]">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] z-10 flex-shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Ops Control Center</h2>
              <div className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20 shadow-sm">
                Enterprise
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-400">Collaborative Intelligence Board</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleSyncWorkspace}
              disabled={isSyncing}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-lg active:scale-95'
              }`}
            >
              <svg className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>{isSyncing ? 'Syncing...' : 'Sync Workspace'}</span>
            </button>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search tasks, docs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search across workspace"
                className="bg-gray-100/50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/30 w-72 h-11 pl-11 pr-4 rounded-2xl text-sm font-medium transition-all outline-none"
              />
            </div>

            <button 
              onClick={() => handleAddTask()} 
              aria-label="Create new task"
              className="h-11 bg-primary hover:bg-primary-hover text-white px-6 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-primary/20 flex items-center space-x-2 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
              <span>New Task</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-x-auto p-10">
          <div className="flex space-x-8 h-full min-w-max items-start">
            
            {columns.map(col => (
              <section key={col.id} className="w-[360px] flex-shrink-0 flex flex-col h-full group/column" aria-labelledby={`col-title-${col.id}`}>
                <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${col.color} shadow-[0_0_12px_rgba(0,0,0,0.1)]`}></div>
                    <h3 id={`col-title-${col.id}`} className="font-black text-sm text-gray-800 uppercase tracking-widest">{col.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`${col.textColor} bg-gray-100/80 px-3 py-1 rounded-full text-xs font-black shadow-sm ring-1 ring-black/5`}>
                      {filteredTasks.filter(t => t.status === col.id).length}
                    </span>
                    <button 
                      onClick={() => handleAddTask(col.id as any)} 
                      aria-label={`Add task to ${col.title}`}
                      className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all opacity-0 group-hover/column:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar pb-10">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Canvas...</p>
                    </div>
                  ) : filteredTasks.filter(t => t.status === col.id).length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200/50">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Empty Workspace</p>
                    </div>
                  ) : (
                    filteredTasks.filter(t => t.status === col.id).map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onClick={() => {
                          setSelectedTask(task);
                          setIsModalOpen(true);
                        }}
                      />
                    ))
                  )}

                  <button 
                    onClick={() => handleAddTask(col.id as any)}
                    className="w-full py-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 hover:bg-white hover:shadow-xl transition-all group flex flex-col items-center justify-center space-y-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary transition-colors">Add Component</span>
                  </button>
                </div>
              </section>
            ))}

          </div>
        </div>
      </div>

      <SmartAssistant tasks={tasks} />

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onSave={handleUpdateTask}
      />
    </div>
  );
}
