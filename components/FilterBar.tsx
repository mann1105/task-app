
import React from 'react';
import { User, Role, Status, Priority } from '../types';
import { STATUSES, PRIORITIES } from '../constants';
import { SearchIcon } from './Icons';

export interface Filters {
  searchTerm: string;
  status: Status | 'ALL';
  priority: Priority | 'ALL';
  assigneeId: string | 'ALL';
}

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  users: User[];
  currentUser: User;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, users, currentUser }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const teamMembers = users.filter(u => u.role === Role.MEMBER);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-4">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="searchTerm"
          placeholder="Search tasks..."
          value={filters.searchTerm}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
        />
      </div>
      <select name="status" value={filters.status} onChange={handleInputChange} className="rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <option value="ALL">All Statuses</option>
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select name="priority" value={filters.priority} onChange={handleInputChange} className="rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <option value="ALL">All Priorities</option>
        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      {currentUser.role === Role.MANAGER && (
         <select name="assigneeId" value={filters.assigneeId} onChange={handleInputChange} className="rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="ALL">All Members</option>
            {teamMembers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      )}
    </div>
  );
};
