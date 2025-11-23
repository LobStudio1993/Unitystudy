import React from 'react';
import { Home, Book, Terminal, MessageSquare, Code2, ChevronRight, PenTool } from 'lucide-react';
import { APP_NAME } from '../constants';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'guidelines', label: 'ガイドライン', icon: Book },
        { id: 'assistant', label: 'AIメンター (技術)', icon: MessageSquare },
        { id: 'spec', label: '仕様書相談', icon: PenTool },
        { id: 'review', label: 'コードレビュー', icon: Code2 },
        { id: 'docs', label: 'ドキュメント生成', icon: Terminal },
    ];

    return (
        <aside className="w-72 bg-[#0B1120]/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col h-full shrink-0 hidden md:flex z-20">
            <div className="p-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Unity</span> {APP_NAME}
                </h1>
                <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide uppercase">Self-Solving Hub</p>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`group relative w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                isActive 
                                    ? 'bg-white/10 text-white shadow-inner' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                            )}
                            <Icon size={20} className={`transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span>{item.label}</span>
                            {isActive && <ChevronRight size={14} className="ml-auto text-slate-500" />}
                        </button>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-800/50">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700/50 shadow-lg">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Philosophy</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        「自分たちより詳しい人はいない」
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;