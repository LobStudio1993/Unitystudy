import React from 'react';
import { PHILOSOPHY_POINTS } from '../constants';
import { Target, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardProps {
    onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    return (
        <div className="space-y-12 pb-10">
            {/* Hero Section */}
            <header className="relative py-8">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl" />
                <h2 className="text-5xl font-bold text-white mb-6 tracking-tight relative">
                    Welcome to <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">Unity DevMate</span>
                </h2>
                <p className="text-slate-400 text-xl max-w-2xl leading-relaxed font-light">
                    学生のためのUnity技術支援プラットフォーム。<br/>
                    安易に答えを求めるのではなく、<strong className="text-indigo-300 font-medium">自己解決能力</strong>を極限まで磨く場所です。
                </p>
            </header>

            {/* Philosophy Grid */}
            <section className="grid md:grid-cols-3 gap-6">
                {PHILOSOPHY_POINTS.map((point, index) => {
                    const Icon = point.icon;
                    return (
                        <div key={index} className="group relative bg-slate-800/20 hover:bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Icon className="text-indigo-400 group-hover:text-indigo-300" size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-100 mb-3">{point.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{point.desc}</p>
                        </div>
                    );
                })}
            </section>

            {/* Startup Guide */}
            <section className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-white/5 rounded-3xl p-10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Target className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">スタートアップガイド</h3>
                </div>
                
                <div className="grid gap-8 md:grid-cols-3 relative z-10">
                    <div className="relative group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">1</div>
                            <h4 className="text-lg font-semibold text-slate-200">Gitの準備</h4>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">まずはプロジェクトをCloneし、自分のブランチを作成してください。</p>
                        <div className="bg-black/40 backdrop-blur rounded-lg p-3 font-mono text-xs text-emerald-400 border border-white/5">
                            git checkout -b feature/your-name
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">2</div>
                            <h4 className="text-lg font-semibold text-slate-200">遊び場の作成</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            完全に自由な自分専用のScene（ホワイトボックス）を作ってください。他人のコードを壊す心配なく実験できます。
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">3</div>
                            <h4 className="text-lg font-semibold text-slate-200">開発 & レビュー</h4>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            ルールを守ってコードを書きましょう。AIレビュー機能を活用してチェックしてください。
                        </p>
                        <button 
                            onClick={() => onNavigate('review')}
                            className="group/btn inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                        >
                            レビュー機能へ移動 <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;