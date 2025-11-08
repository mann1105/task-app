
import React from 'react';
import { User } from '../../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <img
      className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-800`}
      src={user.avatarUrl}
      alt={user.name}
      title={user.name}
    />
  );
};

interface AvatarGroupProps {
    users: User[];
    max?: number;
    size?: 'sm' | 'md' | 'lg';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 3, size = 'md' }) => {
    const displayedUsers = users.slice(0, max);
    const hiddenCount = users.length - max;

    return (
        <div className="flex -space-x-2">
            {displayedUsers.map(user => <Avatar key={user.id} user={user} size={size} />)}
            {hiddenCount > 0 && (
                <div className={`flex items-center justify-center ${size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} rounded-full bg-gray-200 text-gray-600 ring-2 ring-white dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-800`}>
                    +{hiddenCount}
                </div>
            )}
        </div>
    );
}
