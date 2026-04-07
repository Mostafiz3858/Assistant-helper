import React from 'react';
import { ArrowUpRight, ArrowDownRight, Coffee, ShoppingBag, Car, Home } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Expense } from '@/src/types';

const MOCK_TRANSACTIONS: Expense[] = [
  { id: '1', amount: 45.50, category: 'Food', description: 'Starbucks Coffee', date: '2 hours ago' },
  { id: '2', amount: 1200.00, category: 'Housing', description: 'Monthly Rent', date: 'Yesterday' },
  { id: '3', amount: 85.20, category: 'Transport', description: 'Uber Ride', date: 'Yesterday' },
  { id: '4', amount: 210.00, category: 'Shopping', description: 'Apple Store', date: '2 days ago' },
];

const CATEGORY_ICONS: Record<string, any> = {
  Food: Coffee,
  Housing: Home,
  Transport: Car,
  Shopping: ShoppingBag,
};

export const TransactionsList = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Recent Transactions</h3>
        <button className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
      </div>
      <div className="space-y-3">
        {MOCK_TRANSACTIONS.map((tx) => {
          const Icon = CATEGORY_ICONS[tx.category] || ShoppingBag;
          return (
            <div key={tx.id} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60">
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{tx.description}</h4>
                <p className="text-xs text-white/40">{tx.category} • {tx.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">-${tx.amount.toFixed(2)}</p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-rose-400">
                  <ArrowDownRight size={10} />
                  Debit
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
