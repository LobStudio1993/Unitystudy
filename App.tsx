import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Guidelines from './pages/Guidelines';
import AiAssistant from './pages/AiAssistant';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard onNavigate={setActiveTab} />;
            case 'guidelines':
                return <Guidelines />;
            case 'assistant':
                return <AiAssistant mode="general" />;
            case 'spec':
                return <AiAssistant mode="spec" />;
            case 'review':
                return <AiAssistant mode="review" />;
            case 'docs':
                return <AiAssistant mode="docs" />;
            default:
                return <Dashboard onNavigate={setActiveTab} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#0B1120] text-slate-200 overflow-hidden relative selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Sidebar for Desktop */}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-4 z-50">
                <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Unity DevMate</h1>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white transition-colors">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-[#0B1120]/95 backdrop-blur-xl z-40 pt-20 px-4 md:hidden">
                    <nav className="flex flex-col space-y-2">
                        {[
                            { id: 'dashboard', label: 'Dashboard' },
                            { id: 'guidelines', label: 'ガイドライン' },
                            { id: 'assistant', label: 'AIメンター (技術)' },
                            { id: 'spec', label: '仕様書相談' },
                            { id: 'review', label: 'コードレビュー' },
                            { id: 'docs', label: 'ドキュメント生成' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`p-4 text-left rounded-xl font-medium transition-all ${
                                    activeTab === item.id 
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25' 
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="mx-auto max-w-6xl h-full">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;