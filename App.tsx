
import React, { useState, useMemo, useCallback } from 'react';
import { Task, User, Role, Status, AuditLogEntry } from './types';
import { USERS, INITIAL_TASKS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { KanbanView } from './components/KanbanView';
import { TaskModal } from './components/shared/TaskModal';
import { TaskForm } from './components/TaskForm';
import { PlusIcon, LayoutGridIcon, CalendarIcon, BarChartIcon, ChevronDownIcon } from './components/Icons';
import { Avatar } from './components/shared/Avatar';
import { CalendarView } from './components/CalendarView';
import { DashboardView } from './components/DashboardView';
import { FilterBar, Filters } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';

type View = 'kanban' | 'calendar' | 'dashboard' | 'list';

const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', INITIAL_TASKS);
  const [currentUser, setCurrentUser] = useLocalStorage<User>('currentUser', USERS[0]);
  const [activeView, setActiveView] = useState<View>('kanban');
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    status: 'ALL',
    priority: 'ALL',
    assigneeId: 'ALL',
  });

  const handleUpdateTask = (updatedTask: Task) => {
    let tasksToUpdate = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);

    // Handle recurring task completion
    const originalTask = tasks.find(t => t.id === updatedTask.id);
    if (originalTask && originalTask.status !== Status.COMPLETED && updatedTask.status === Status.COMPLETED && updatedTask.isRecurring) {
        const newDueDate = new Date(updatedTask.dueDate);
        switch (updatedTask.recurrenceInterval) {
            case 'daily': newDueDate.setDate(newDueDate.getDate() + 1); break;
            case 'weekly': newDueDate.setDate(newDueDate.getDate() + 7); break;
            case 'monthly': newDueDate.setMonth(newDueDate.getMonth() + 1); break;
        }
        
        const newRecurringTask: Task = {
            ...updatedTask,
            id: crypto.randomUUID(),
            status: Status.TODO,
            dueDate: newDueDate.toISOString(),
            comments: [],
            attachments: [],
            auditLog: [{ id: crypto.randomUUID(), userId: 'system', action: `Recurring task created from #${updatedTask.id}`, timestamp: new Date().toISOString() }]
        };
        tasksToUpdate.push(newRecurringTask);
    }
    setTasks(tasksToUpdate);
    if (selectedTask?.id === updatedTask.id) {
        setSelectedTask(updatedTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setSelectedTask(null);
  }

  const handleSaveNewTask = (newTaskData: Omit<Task, 'id' | 'comments' | 'attachments' | 'auditLog'>) => {
    const auditLogEntry: AuditLogEntry = { id: crypto.randomUUID(), userId: currentUser.id, action: 'Task created', timestamp: new Date().toISOString() };
    const newTask: Task = {
      ...newTaskData,
      id: crypto.randomUUID(),
      comments: [],
      attachments: [],
      auditLog: [auditLogEntry],
    };
    setTasks([...tasks, newTask]);
    setIsTaskFormOpen(false);
  };
  
  const handleTaskStatusChange = useCallback((taskId: string, newStatus: Status) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
        const updatedTask = {
            ...task,
            status: newStatus,
            auditLog: [...task.auditLog, { id: crypto.randomUUID(), userId: currentUser.id, action: `Status changed to ${newStatus}`, timestamp: new Date().toISOString() }]
        };
        handleUpdateTask(updatedTask);
    }
  }, [tasks, currentUser.id]);

  const filteredTasks = useMemo(() => {
    let filtered = currentUser.role === Role.MANAGER
      ? tasks
      : tasks.filter(task => task.assigneeIds.includes(currentUser.id));
      
    if (filters.searchTerm) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
            t.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
    }
    if(filters.status !== 'ALL') filtered = filtered.filter(t => t.status === filters.status);
    if(filters.priority !== 'ALL') filtered = filtered.filter(t => t.priority === filters.priority);
    if(filters.assigneeId !== 'ALL' && currentUser.role === Role.MANAGER) {
        filtered = filtered.filter(t => t.assigneeIds.includes(filters.assigneeId));
    }
    
    return filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks, currentUser, filters]);

  const renderView = () => {
    switch (activeView) {
      case 'kanban':
        return <KanbanView tasks={filteredTasks} users={USERS} onTaskClick={setSelectedTask} onTaskStatusChange={handleTaskStatusChange} />;
      case 'calendar':
        return <CalendarView tasks={filteredTasks} users={USERS} onTaskClick={setSelectedTask} />;
      case 'dashboard':
        return currentUser.role === Role.MANAGER ? <DashboardView tasks={tasks} users={USERS}/> : <p className="p-4">Dashboard is available for managers only.</p>;
      case 'list':
          return <div className="p-4 space-y-4">{filteredTasks.map(task => <TaskCard key={task.id} task={task} users={USERS} onClick={() => setSelectedTask(task)} />)}</div>
      default:
        return null;
    }
  };

  const NavItem: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        activeView === view
          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-brand-600 dark:text-brand-400">TaskFlow Pro</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {currentUser.role === Role.MANAGER && <NavItem view="dashboard" label="Dashboard" icon={<BarChartIcon className="w-5 h-5"/>} />}
          <NavItem view="kanban" label="Kanban Board" icon={<LayoutGridIcon className="w-5 h-5"/>} />
          <NavItem view="calendar" label="Calendar" icon={<CalendarIcon className="w-5 h-5"/>} />
          {/* <NavItem view="list" label="List" icon={<svg... />} /> */}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
           <div className="group relative">
                <button className="w-full flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <div className="flex items-center space-x-2">
                        <Avatar user={currentUser} size="md"/>
                        <div>
                            <p className="text-sm font-semibold text-left">{currentUser.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-left">{currentUser.role}</p>
                        </div>
                    </div>
                    <ChevronDownIcon className="w-4 h-4"/>
                </button>
                <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {USERS.map(user => (
                        <button key={user.id} onClick={() => setCurrentUser(user)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2">
                            <Avatar user={user} size="sm" />
                            <span>{user.name}</span>
                        </button>
                    ))}
                </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold capitalize">{activeView} View</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentUser.role === Role.MANAGER ? "Viewing all team tasks" : "Viewing tasks assigned to you"}
            </p>
          </div>
          <button
            onClick={() => setIsTaskFormOpen(true)}
            className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-sm"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Task
          </button>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
            <FilterBar filters={filters} onFiltersChange={setFilters} users={USERS} currentUser={currentUser} />
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
                {renderView()}
            </div>
        </div>

      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          users={USERS}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
      {isTaskFormOpen && (
        <TaskForm 
            onClose={() => setIsTaskFormOpen(false)}
            onSave={handleSaveNewTask}
            users={USERS}
            currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default App;
