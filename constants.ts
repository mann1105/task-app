
import { User, Task, Role, Status, Priority } from './types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Manager', role: Role.MANAGER, avatarUrl: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Brenda Developer', role: Role.MEMBER, avatarUrl: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Charlie Designer', role: Role.MEMBER, avatarUrl: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Diana QA', role: Role.MEMBER, avatarUrl: 'https://i.pravatar.cc/150?u=u4' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design new landing page',
    description: 'Create a modern and responsive design for the new landing page. Focus on user engagement and conversion. Use the new brand guidelines.',
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeIds: ['u3'],
    comments: [
      { id: 'c1', userId: 'u1', content: 'Great start, Charlie! Let\'s review the wireframes tomorrow.', timestamp: new Date().toISOString() }
    ],
    attachments: [],
    auditLog: [{ id: 'a1', userId: 'u1', action: 'Task created', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }],
    isRecurring: false,
  },
  {
    id: 't2',
    title: 'Develop user authentication feature',
    description: 'Implement JWT-based authentication for the main application. Include sign-up, login, and logout functionalities.',
    status: Status.TODO,
    priority: Priority.HIGH,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeIds: ['u2'],
    comments: [],
    attachments: [],
    auditLog: [{ id: 'a2', userId: 'u1', action: 'Task created', timestamp: new Date().toISOString() }],
    isRecurring: false,
  },
  {
    id: 't3',
    title: 'Test payment gateway integration',
    description: 'Perform thorough testing of the Stripe payment gateway integration. Cover all edge cases and scenarios.',
    status: Status.TODO,
    priority: Priority.MEDIUM,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeIds: ['u4'],
    comments: [],
    attachments: [],
    auditLog: [{ id: 'a3', userId: 'u1', action: 'Task created', timestamp: new Date().toISOString() }],
    isRecurring: false,
  },
  {
    id: 't4',
    title: 'Update Q3 marketing report',
    description: 'Finalize the Q3 marketing report with the latest campaign data and performance metrics.',
    status: Status.COMPLETED,
    priority: Priority.LOW,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeIds: ['u1'],
    comments: [],
    attachments: [],
    auditLog: [{ id: 'a4', userId: 'u1', action: 'Task completed', timestamp: new Date().toISOString() }],
    isRecurring: true,
    recurrenceInterval: 'monthly',
  },
    {
    id: 't5',
    title: 'Fix responsive layout bug on mobile',
    description: 'The main dashboard layout breaks on screen widths below 400px. Investigate and apply a fix.',
    status: Status.IN_PROGRESS,
    priority: Priority.MEDIUM,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeIds: ['u2', 'u3'],
    comments: [],
    attachments: [],
    auditLog: [{ id: 'a5', userId: 'u2', action: 'Task started', timestamp: new Date().toISOString() }],
    isRecurring: false,
  },
    {
    id: 't6',
    title: 'Prepare weekly project sync slides',
    description: 'Compile updates from all team members and prepare a presentation for the weekly sync meeting.',
    status: Status.TODO,
    priority: Priority.LOW,
    dueDate: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeIds: ['u1'],
    comments: [],
    attachments: [],
    auditLog: [{ id: 'a6', userId: 'u1', action: 'Task created', timestamp: new Date().toISOString() }],
    isRecurring: true,
    recurrenceInterval: 'weekly',
  },
];

export const STATUSES = Object.values(Status);
export const PRIORITIES = Object.values(Priority);
