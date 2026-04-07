import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Bell, 
  CheckSquare, 
  StickyNote, 
  Plus, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Settings,
  User,
  Navigation,
  Home,
  Briefcase,
  ShoppingBag,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { GlassCard } from './components/GlassCard';
import { TransactionsList } from './components/TransactionsList';
import { cn } from './lib/utils';
import { Expense, Reminder, Task, Priority, Location } from './types';
import { searchPlaces } from './services/geminiService';

const MOCK_EXPENSES_DATA = [
  { name: 'Mon', amount: 120 },
  { name: 'Tue', amount: 450 },
  { name: 'Wed', amount: 300 },
  { name: 'Thu', amount: 700 },
  { name: 'Fri', amount: 200 },
  { name: 'Sat', amount: 900 },
  { name: 'Sun', amount: 400 },
];

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Review Q1 Financials', priority: 'High', completed: false, dueDate: 'Today' },
  { id: '2', title: 'Executive Board Meeting', priority: 'High', completed: false, dueDate: 'Today' },
  { id: '3', title: 'Approve Marketing Budget', priority: 'Medium', completed: true, dueDate: 'Yesterday' },
];

const MOCK_REMINDERS: Reminder[] = [
  { id: '1', title: 'Electricity Bill Due', date: 'In 2 days', type: 'bill' },
  { id: '2', title: 'Flight to London', date: 'Tomorrow, 10:00 AM', type: 'deadline' },
];

const INITIAL_LOCATIONS: Location[] = [
  { id: '1', title: 'Headquarters', type: 'office', uri: 'https://www.google.com/maps/search/Headquarters' },
  { id: '2', title: 'Main Residence', type: 'home', uri: 'https://www.google.com/maps/search/Home' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{title: string, uri: string}[]>([]);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchPlaces(searchQuery, userCoords || undefined);
      setSearchResults(result.links);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addLocation = (result: {title: string, uri: string}, type: Location['type']) => {
    const newLoc: Location = {
      id: Math.random().toString(36).substr(2, 9),
      title: result.title,
      type,
      uri: result.uri
    };
    setLocations([...locations, newLoc]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'home': return <Home size={18} />;
      case 'office': return <Briefcase size={18} />;
      case 'shop': return <ShoppingBag size={18} />;
      default: return <MapPin size={18} />;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-black/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/50">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Lumina</h1>
              <p className="text-xs text-white/40">Executive Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white">
              <Search size={20} />
            </button>
            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/10">
              <img 
                src="https://picsum.photos/seed/avatar/100/100" 
                alt="User" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-6 lg:h-[800px]"
            >
              {/* Main Expense Chart - Bento Large */}
              <GlassCard className="md:col-span-8 md:row-span-3">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Total Expenses</h2>
                    <p className="text-3xl font-bold mt-1">$12,450.00</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                    <TrendingUp size={14} />
                    +12.5%
                  </div>
                </div>
                
                <div className="h-[200px] w-full md:h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_EXPENSES_DATA}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(10px)'
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Quick Actions / Balance - Bento Small */}
              <GlassCard className="md:col-span-4 md:row-span-2 flex flex-col justify-between" delay={0.1}>
                <div>
                  <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Available Balance</h2>
                  <p className="text-4xl font-bold mt-2 tracking-tight">$45,200</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-600 active:scale-95">
                    Transfer
                  </button>
                  <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95">
                    <Plus size={24} />
                  </button>
                </div>
              </GlassCard>

              {/* Reminders - Bento Medium */}
              <GlassCard className="md:col-span-4 md:row-span-4" delay={0.2}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Reminders</h2>
                  <Bell size={18} className="text-white/40" />
                </div>
                <div className="space-y-4">
                  {MOCK_REMINDERS.map((reminder) => (
                    <div key={reminder.id} className="group flex items-start gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10">
                      <div className={cn(
                        "mt-1 flex h-8 w-8 items-center justify-center rounded-lg",
                        reminder.type === 'bill' ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                      )}>
                        <Bell size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{reminder.title}</h3>
                        <p className="text-xs text-white/40">{reminder.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Tasks - Bento Large */}
              <GlassCard className="md:col-span-4 md:row-span-4" delay={0.3}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Today's Tasks</h2>
                  <CheckSquare size={18} className="text-white/40" />
                </div>
                <div className="space-y-3">
                  {MOCK_TASKS.map((task) => (
                    <div key={task.id} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10">
                      <div className={cn(
                        "h-5 w-5 rounded border-2 transition-all cursor-pointer",
                        task.completed ? "bg-indigo-500 border-indigo-500" : "border-white/20"
                      )}>
                        {task.completed && <Plus size={16} className="text-white rotate-45" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={cn("text-sm font-medium", task.completed && "text-white/30 line-through")}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-tighter px-1.5 rounded",
                            task.priority === 'High' ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                          )}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-white/30">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Memo - Bento Small */}
              <GlassCard className="md:col-span-4 md:row-span-2" delay={0.4}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Quick Memo</h2>
                  <StickyNote size={18} className="text-white/40" />
                </div>
                <textarea 
                  placeholder="Start typing..."
                  className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 focus:outline-none resize-none h-24"
                />
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'locations' && (
            <motion.div 
              key="locations"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-12"
            >
              <GlassCard className="md:col-span-12">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Saved Locations</h2>
                      <Navigation size={18} className="text-white/40" />
                    </div>
                    
                    <div className="space-y-4">
                      {locations.map((loc) => (
                        <div key={loc.id} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                            {getLocationIcon(loc.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{loc.title}</h4>
                            <p className="text-xs text-white/40 capitalize">{loc.type}</p>
                          </div>
                          <a 
                            href={loc.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">Find & Mark Places</h2>
                    <form onSubmit={handleSearch} className="relative mb-6">
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for office, shop, home..."
                        className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <button 
                        type="submit"
                        disabled={isSearching}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
                      >
                        {isSearching ? <Loader2 size={14} className="animate-spin" /> : 'Search'}
                      </button>
                    </form>

                    <div className="space-y-3">
                      {searchResults.map((result, idx) => (
                        <div key={idx} className="rounded-2xl bg-white/5 p-4 border border-white/5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">{result.title}</h4>
                            <a href={result.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400">
                              <ExternalLink size={14} />
                            </a>
                          </div>
                          <div className="flex gap-2">
                            {(['home', 'office', 'shop', 'other'] as const).map((type) => (
                              <button
                                key={type}
                                onClick={() => addLocation(result, type)}
                                className="flex-1 rounded-lg bg-white/5 py-2 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:bg-white/10 hover:text-white transition-all"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {searchResults.length === 0 && !isSearching && searchQuery && (
                        <p className="text-center text-xs text-white/20 py-8">No results found. Try searching for a specific place.</p>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'reminders' && (
            <motion.div 
              key="reminders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-12"
            >
              <GlassCard className="md:col-span-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Upcoming Reminders</h2>
                  <button className="flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-600">
                    <Plus size={18} />
                    New Reminder
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Bills', 'Meetings', 'Deadlines'].map((category) => (
                    <div key={category} className="rounded-3xl bg-white/5 p-6 border border-white/5">
                      <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">{category}</h3>
                      <div className="space-y-4">
                        {MOCK_REMINDERS.map((r) => (
                          <div key={r.id} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                            <p className="text-sm">{r.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4 w-full max-w-md">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur-2xl ring-1 ring-white/5">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'locations', icon: MapPin, label: 'Maps' },
            { id: 'reminders', icon: Bell, label: 'Alerts' },
            { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
            { id: 'memos', icon: StickyNote, label: 'Notes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                activeTab === item.id ? "text-white" : "text-white/40 hover:text-white/60"
              )}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon size={20} />
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}


