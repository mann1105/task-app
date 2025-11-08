
export enum Role {
  MANAGER = 'Manager',
  MEMBER = 'Member',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarUrl: string;
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Status {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // e.g., 'image/png' or 'application/pdf'
  url: string; // Could be a data URL or a link to a file
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  assigneeIds: string[];
  comments: Comment[];
  attachments: Attachment[];
  auditLog: AuditLogEntry[];
  isRecurring: boolean;
  recurrenceInterval?: 'daily' | 'weekly' | 'monthly';
}
