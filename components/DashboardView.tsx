
import React from 'react';
import { Task, User, Role, Status } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardViewProps {
  tasks: Task[];
  users: User[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ tasks, users }) => {
  const teamMembers = users.filter(u => u.role === Role.MEMBER);

  // Card metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === Status.COMPLETED).length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== Status.COMPLETED).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Data for charts
  const statusDistribution = [
    { name: 'To Do', value: tasks.filter(t => t.status === Status.TODO).length },
    { name: 'In Progress', value: tasks.filter(t => t.status === Status.IN_PROGRESS).length },
    { name: 'Completed', value: tasks.filter(t => t.status === Status.COMPLETED).length },
  ];

  const overdueByMember = teamMembers.map(member => ({
    name: member.name.split(' ')[0],
    overdue: tasks.filter(t => t.assigneeIds.includes(member.id) && new Date(t.dueDate) < new Date() && t.status !== Status.COMPLETED).length,
    completed: tasks.filter(t => t.assigneeIds.includes(member.id) && t.status === Status.COMPLETED).length,
  }));
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  const Card: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
  
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Tasks" value={totalTasks} description="All tasks in the system" />
        <Card title="Completion Rate" value={`${completionRate}%`} description="Of all tasks" />
        <Card title="Completed Tasks" value={completedTasks} description="Finished on time" />
        <Card title="Overdue Tasks" value={overdueTasks} description="Past their due date" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {statusDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-4">Team Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overdueByMember}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Completed"/>
              <Bar dataKey="overdue" stackId="a" fill="#ff7300" name="Overdue"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
