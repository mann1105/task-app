
import React from 'react';
import { Task, User } from '../types';
import { formatDate } from '../utils';
import { AvatarGroup } from './shared/Avatar';
import { PriorityBadge, StatusBadge } from './shared/Badges';
import { PaperclipIcon, MessageSquareIcon, ClockIcon } from './Icons';

interface TaskCardProps {
  task: Task;
  users: User[];
  onClick: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, users, onClick, onDragStart }) => {
  const assignees = users.filter(user => task.assigneeIds.includes(user.id));
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-brand-500 dark:hover:border-brand-500 cursor-pointer transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 pr-2">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className={`flex items-center ${isOverdue ? 'text-red-500 font-semibold' : ''}`}>
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="flex items-center space-x-2">
          {task.attachments.length > 0 && (
            <div className="flex items-center">
              <PaperclipIcon className="w-4 h-4" />
              <span className="ml-1">{task.attachments.length}</span>
            </div>
          )}
          {task.comments.length > 0 && (
             <div className="flex items-center">
              <MessageSquareIcon className="w-4 h-4" />
              <span className="ml-1">{task.comments.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <AvatarGroup users={assignees} size="sm" />
        <StatusBadge status={task.status} />
      </div>
    </div>
  );
};
