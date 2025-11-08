
import React from 'react';
import { Priority, Status } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const priorityColors = {
    [Priority.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [Priority.LOW]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[priority]}`}>
      {priority}
    </span>
  );
};

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColors = {
    [Status.TODO]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [Status.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [Status.COMPLETED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
      {status}
    </span>
  );
};
