
import React from 'react';
import { Task, User, Status } from '../types';
import { STATUSES } from '../constants';
import { TaskCard } from './TaskCard';

interface KanbanViewProps {
  tasks: Task[];
  users: User[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, newStatus: Status) => void;
}

const KanbanColumn: React.FC<{
  status: Status;
  tasks: Task[];
  users: User[];
  onTaskClick: (task: Task) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}> = ({ status, tasks, users, onTaskClick, onDrop, onDragOver, onDragStart }) => {
  const statusColors = {
    [Status.TODO]: 'border-t-gray-400',
    [Status.IN_PROGRESS]: 'border-t-blue-500',
    [Status.COMPLETED]: 'border-t-purple-500',
  };

  return (
    <div
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 w-full md:w-1/3 flex-shrink-0"
    >
      <h2 className={`text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-300 dark:border-gray-600 ${statusColors[status]}`}>
        {status} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{tasks.length}</span>
      </h2>
      <div className="space-y-4 h-full overflow-y-auto">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} users={users} onClick={() => onTaskClick(task)} onDragStart={onDragStart}/>
        ))}
      </div>
    </div>
  );
};

export const KanbanView: React.FC<KanbanViewProps> = ({ tasks, users, onTaskClick, onTaskStatusChange }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Status) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            onTaskStatusChange(taskId, newStatus);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-full p-4 overflow-x-auto">
      {STATUSES.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter(t => t.status === status)}
          users={users}
          onTaskClick={onTaskClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
};
