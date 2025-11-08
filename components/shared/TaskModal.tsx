
import React, { useState } from 'react';
import { Task, User, Comment, Attachment, Status, Priority, AuditLogEntry } from '../../types';
import { USERS, STATUSES, PRIORITIES } from '../../constants';
import { formatDate, formatDateTime, fileToBase64 } from '../../utils';
import { Avatar } from './Avatar';
import { PriorityBadge, StatusBadge } from './Badges';
import { ClockIcon, MessageSquareIcon, PaperclipIcon, Trash2Icon, XCircleIcon } from '../Icons';

interface TaskModalProps {
  task: Task;
  users: User[];
  currentUser: User;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, users, currentUser, onClose, onUpdateTask, onDeleteTask }) => {
  const [newComment, setNewComment] = useState('');

  const getAssignees = () => users.filter(u => task.assigneeIds.includes(u.id));

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedTask: Task = { 
        ...task, 
        status: e.target.value as Status,
        auditLog: [...task.auditLog, { id: crypto.randomUUID(), userId: currentUser.id, action: `Status changed to ${e.target.value}`, timestamp: new Date().toISOString()}]
    };
    onUpdateTask(updatedTask);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedTask: Task = { 
        ...task, 
        priority: e.target.value as Priority,
        auditLog: [...task.auditLog, { id: crypto.randomUUID(), userId: currentUser.id, action: `Priority changed to ${e.target.value}`, timestamp: new Date().toISOString()}]
    };
    onUpdateTask(updatedTask);
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
      };
      const updatedTask: Task = { 
          ...task,
          comments: [...task.comments, comment],
          auditLog: [...task.auditLog, { id: crypto.randomUUID(), userId: currentUser.id, action: `Added a comment`, timestamp: new Date().toISOString()}]
      };
      onUpdateTask(updatedTask);
      setNewComment('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newAttachments: Attachment[] = await Promise.all(files.map(async file => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        url: await fileToBase64(file),
      })));
      
      const updatedTask: Task = {
        ...task,
        attachments: [...task.attachments, ...newAttachments],
        auditLog: [...task.auditLog, { id: crypto.randomUUID(), userId: currentUser.id, action: `Added ${newAttachments.length} attachment(s)`, timestamp: new Date().toISOString()}]
      };
      onUpdateTask(updatedTask);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due on {formatDate(task.dueDate)}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{task.description}</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <select value={task.status} onChange={handleStatusChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md">
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                        <select value={task.priority} onChange={handlePriorityChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md">
                            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Assignees</h4>
                        <div className="mt-2 space-y-2">
                            {getAssignees().map(user => (
                                <div key={user.id} className="flex items-center space-x-2">
                                    <Avatar user={user} size="sm"/>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{user.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center"><PaperclipIcon className="w-5 h-5 mr-2" /> Attachments</h3>
                <div className="space-y-2">
                    {task.attachments.map(att => (
                        <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                            {att.type.startsWith('image/') ? <img src={att.url} className="w-10 h-10 rounded object-cover mr-3"/> : <PaperclipIcon className="w-6 h-6 mr-3 text-gray-500"/> }
                            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">{att.name}</span>
                        </a>
                    ))}
                </div>
                <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-200">
                        + Add attachment
                    </label>
                    <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleFileUpload}/>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center"><MessageSquareIcon className="w-5 h-5 mr-2" /> Comments</h3>
                <div className="space-y-4">
                    {task.comments.map(comment => {
                        const user = users.find(u => u.id === comment.userId);
                        return user ? (
                            <div key={comment.id} className="flex items-start space-x-3">
                                <Avatar user={user} size="md"/>
                                <div className="flex-1">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(comment.timestamp)}</p>
                                        </div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ) : null;
                    })}
                </div>
                <div className="mt-4 flex items-start space-x-3">
                    <Avatar user={currentUser} size="md"/>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:text-white"
                            rows={2}
                        />
                        <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 text-sm font-semibold">
                            Comment
                        </button>
                    </div>
                </div>
            </div>

             <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center"><ClockIcon className="w-5 h-5 mr-2" /> Audit Log</h3>
                <ul className="space-y-3">
                    {task.auditLog.slice().reverse().map(log => {
                        const user = users.find(u => u.id === log.userId);
                        return (
                            <li key={log.id} className="flex items-center text-sm">
                                {user && <Avatar user={user} size="sm" />}
                                <span className="ml-2 text-gray-600 dark:text-gray-300">
                                    <span className="font-semibold">{user?.name || 'System'}</span> {log.action}
                                </span>
                                <span className="ml-auto text-gray-400 dark:text-gray-500 text-xs">{formatDateTime(log.timestamp)}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
                onClick={() => { if(window.confirm('Are you sure you want to delete this task?')) { onDeleteTask(task.id); onClose(); }}}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm font-semibold"
            >
               <Trash2Icon className="w-4 h-4 mr-2"/> Delete Task
            </button>
        </div>
      </div>
    </div>
  );
};
