
import React, { useState } from 'react';
import { Task, User, Status, Priority, Role } from '../types';

interface TaskFormProps {
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'comments' | 'attachments' | 'auditLog'>) => void;
  users: User[];
  currentUser: User;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSave, users, currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(Status.TODO);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const teamMembers = users.filter(u => u.role === Role.MEMBER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      description,
      status,
      priority,
      dueDate: new Date(dueDate).toISOString(),
      assigneeIds,
      isRecurring,
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
    });
  };

  const handleAssigneeChange = (userId: string) => {
    setAssigneeIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Priority)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {Object.values(Priority).map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign to</label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {teamMembers.map(user => (
                  <label key={user.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" checked={assigneeIds.includes(user.id)} onChange={() => handleAssigneeChange(user.id)} className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500" />
                    <span className="text-sm text-gray-800 dark:text-gray-200">{user.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
                <div className="flex items-center">
                    <input id="recurring" type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"/>
                    <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Recurring Task</label>
                </div>
                {isRecurring && (
                    <select value={recurrenceInterval} onChange={e => setRecurrenceInterval(e.target.value as any)} className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                )}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 text-sm font-semibold">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};
