
import React, { useState } from 'react';
import { Task, User } from '../types';
import { PriorityBadge } from './shared/Badges';

interface CalendarViewProps {
  tasks: Task[];
  users: User[];
  onTaskClick: (task: Task) => void;
}

const CalendarHeader: React.FC<{
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}> = ({ currentDate, onPrevMonth, onNextMonth }) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between mb-4 px-2">
      <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&lt;</button>
      <h2 className="text-xl font-bold">{monthName} {year}</h2>
      <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&gt;</button>
    </div>
  );
};

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, users, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const tasksByDate: { [key: string]: Task[] } = {};
  tasks.forEach(task => {
    const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
    if (!tasksByDate[dueDate]) {
      tasksByDate[dueDate] = [];
    }
    tasksByDate[dueDate].push(task);
  });
  
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
      <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
      <div className="grid grid-cols-7 gap-px flex-grow bg-gray-200 dark:bg-gray-700">
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold py-2 bg-gray-100 dark:bg-gray-900 text-sm">{day}</div>
        ))}
        {days.map(d => {
          const dateKey = d.toISOString().split('T')[0];
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = d.toDateString() === new Date().toDateString();
          return (
            <div key={d.toISOString()} className={`p-2 bg-white dark:bg-gray-800 ${isCurrentMonth ? '' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400'} ${isToday ? 'border-2 border-brand-500' : ''}`}>
              <div className={`font-semibold ${isToday ? 'text-brand-600' : ''}`}>{d.getDate()}</div>
              <div className="mt-1 space-y-1">
                {tasksByDate[dateKey]?.map(task => (
                  <div key={task.id} onClick={() => onTaskClick(task)} className="p-1 rounded-md bg-brand-100 dark:bg-brand-900/50 cursor-pointer hover:bg-brand-200 dark:hover:bg-brand-900">
                    <p className="text-xs font-medium text-brand-800 dark:text-brand-200 truncate">{task.title}</p>
                    <div className="mt-1"><PriorityBadge priority={task.priority}/></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
