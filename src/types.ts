export type Priority = 'High' | 'Medium' | 'Low';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  type: 'bill' | 'meeting' | 'deadline';
  recurring?: boolean;
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
}

export interface Memo {
  id: string;
  content: string;
  timestamp: string;
}

export interface Location {
  id: string;
  title: string;
  address?: string;
  type: 'home' | 'office' | 'shop' | 'other';
  uri: string;
}
