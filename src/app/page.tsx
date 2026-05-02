"use client";

import React from 'react';

interface TaskCardProps {
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  assignees: { name: string; initial: string; bg: string }[];
  dueDate: string;
  isOverdue?: boolean;
  progress?: number | null;
}

// Optimized for fast rendering using React.memo to prevent unnecessary re-renders in the Kanban board
const TaskCard = React.memo(({ 
  title, 
  description, 
  tag, 
  tagColor, 
  assignees, 
  dueDate, 
  isOverdue = false,
  progress = null 
}: TaskCardProps) => {
  return (
    <div className={`p-4 rounded-xl shadow-sm border transition-all group ${
      isOverdue 
        ? 'bg-red-50/80 border-red-300 ring-1 ring-red-200 hover:shadow-md' 
        : 'bg-white border-gray-200 hover:shadow-md hover:border-[#4285F4]/30 cursor-pointer'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`${tagColor} text-xs font-semibold px-2.5 py-1 rounded-md`}>{tag}</span>
        {isOverdue && (
          <span className="flex items-center text-xs font-bold text-red-600 bg-red-100/80 border border-red-200 px-2 py-0.5 rounded-full animate-pulse shadow-sm">
            OVERDUE
          </span>
        )}
      </div>
      
      <h4 className={`font-semibold mb-2 leading-snug ${isOverdue ? 'text-red-900' : 'text-gray-800'}`}>
        {title}
      </h4>
      <p className={`text-sm mb-4 line-clamp-2 ${isOverdue ? 'text-red-700/80' : 'text-gray-500'}`}>
        {description}
      </p>
      
      {progress !== null && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1 font-medium text-gray-500">
            <span>Progress</span>
            <span className="text-[#4285F4]">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-[#4285F4] h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Visibility Feature: Google Chat Ping for Overdue Tasks */}
      {isOverdue && (
        <button className="w-full mb-4 flex items-center justify-center space-x-2 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95">
          {/* Google Chat Icon Approximation */}
          <svg className="w-4 h-4 text-[#00832D]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.76 1.48 5.23 3.8 6.84.28.19.46.5.46.85v3.13c0 .35.39.56.68.36l3.41-2.31c.21-.14.46-.22.72-.22H12c5.52 0 10-3.92 10-8.75S17.52 2 12 2zm3.5 10H8.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h7c.28 0 .5.22.5.5s-.22.5-.5.5zm0-3H8.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h7c.28 0 .5.22.5.5s-.22.5-.5.5z"/>
          </svg>
          <span>Ping Team on Google Chat</span>
        </button>
      )}

      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {assignees.map((a: any, i: number) => (
            <div key={i} title={a.name} className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm ${a.bg}`}>
              {a.initial}
            </div>
          ))}
        </div>
        <span className={`text-xs font-medium flex items-center px-2 py-1 rounded-md border ${
          isOverdue ? 'text-red-700 bg-red-100/50 border-red-200' : 'text-gray-500 bg-gray-100 border-gray-200/50'
        }`}>
          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {dueDate}
        </span>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for tasks from Firebase
  useEffect(() => {
    try {
      const tasksRef = collection(db, 'tasks');
      const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
        const fetchedTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(fetchedTasks);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase not fully configured yet", err);
      setLoading(false);
    }
  }, []);

  const handleAddTask = async () => {
    try {
      const tasksRef = collection(db, 'tasks');
      await addDoc(tasksRef, {
        title: "New Team Task",
        description: "Click to edit this task description and add Google Drive links.",
        tag: "General",
        tagColor: "bg-blue-100 text-blue-700",
        assignees: [{ name: "You", initial: "U", bg: "bg-gray-800" }],
        dueDate: "Pending",
        isOverdue: false,
        status: "todo",
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Failed to add task. Ensure Firebase rules allow writing.");
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA]">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Task Canvas</h2>
          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md border border-green-200">Active Sprint</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 16L21 19.5V4.5L16 8V16Z" fill="#00A95C"/>
              <path d="M16 16C16 17.1046 15.1046 18 14 18H5C3.89543 18 3 17.1046 3 16V8C3 6.89543 3.89543 6 5 6H14C15.1046 6 16 6.89543 16 8V16Z" fill="#FFC107"/>
              <path d="M3 8C3 6.89543 3.89543 6 5 6H10V18H5C3.89543 18 3 17.1046 3 16V8Z" fill="#4285F4"/>
              <path d="M10 6H14C15.1046 6 16 6.89543 16 8V10H10V6Z" fill="#EA4335"/>
            </svg>
            <span>Create Meeting</span>
          </button>
          
          <button onClick={handleAddTask} className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-[#4285F4]/30 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Canvas Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <div className="flex space-x-6 h-full items-start">
          
          {/* Column: To Do */}
          <div className="w-80 flex-shrink-0 flex flex-col bg-gray-50/80 rounded-xl p-4 border border-gray-200 shadow-sm max-h-full">
            <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <h3 className="font-semibold text-gray-700">To Do</h3>
              </div>
              <span className="bg-gray-200 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-bold">{todoTasks.length || 0}</span>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {loading && <p className="text-sm text-gray-500 text-center py-4">Loading tasks...</p>}
              
              {!loading && todoTasks.length === 0 && (
                <div className="text-center py-8 opacity-50">
                  <p className="text-sm text-gray-500">No tasks yet.</p>
                </div>
              )}

              {todoTasks.map(task => (
                <TaskCard 
                  key={task.id}
                  title={task.title} 
                  description={task.description}
                  tag={task.tag}
                  tagColor={task.tagColor}
                  assignees={task.assignees || []}
                  dueDate={task.dueDate}
                  isOverdue={task.isOverdue}
                />
              ))}

              {/* Add Task Placeholder */}
              <div onClick={handleAddTask} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-[#4285F4]/30 transition-all group border-dashed border-2 bg-gray-50 hover:bg-white">
                <div className="flex justify-center items-center h-12">
                  <span className="text-gray-400 font-medium text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Task
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="w-80 flex-shrink-0 flex flex-col bg-gray-50/80 rounded-xl p-4 border border-gray-200 shadow-sm max-h-full">
            <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4285F4] animate-pulse"></div>
                <h3 className="font-semibold text-gray-700">In Progress</h3>
              </div>
              <span className="bg-[#E8F0FE] text-[#1967D2] text-xs px-2.5 py-0.5 rounded-full font-bold">{inProgressTasks.length || 0}</span>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {inProgressTasks.map(task => (
                <TaskCard 
                  key={task.id}
                  title={task.title} 
                  description={task.description}
                  tag={task.tag}
                  tagColor={task.tagColor}
                  assignees={task.assignees || []}
                  dueDate={task.dueDate}
                  progress={task.progress}
                />
              ))}
            </div>
          </div>

          {/* Column: Done */}
          <div className="w-80 flex-shrink-0 flex flex-col bg-gray-50/80 rounded-xl p-4 border border-gray-200 shadow-sm max-h-full opacity-80">
            <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#34A853]"></div>
                <h3 className="font-semibold text-gray-700">Done</h3>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-bold">{doneTasks.length || 0}</span>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {doneTasks.map(task => (
                <TaskCard 
                  key={task.id}
                  title={task.title} 
                  description={task.description}
                  tag={task.tag}
                  tagColor={task.tagColor}
                  assignees={task.assignees || []}
                  dueDate={task.dueDate}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
