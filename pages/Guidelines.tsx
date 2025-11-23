import React from 'react';
import { CODING_RULES, DOC_TEMPLATE } from '../constants';
import { Copy } from 'lucide-react';

const Guidelines: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-10">
            <header className="border-b border-slate-800/50 pb-8">
                <h2 className="text-3xl font-bold text-white mb-3">プロジェクト・ガイドライン</h2>
                <p className="text-slate-400 text-lg font-light">
                    チーム全員が快適に開発し、バグを未然に防ぐための共通プロトコル。
                </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CODING_RULES.map((rule) => {
                    const Icon = rule.icon;
                    return (
                        <div key={rule.id} className="bg-slate-800/20 backdrop-blur border border-white/5 rounded-2xl overflow-hidden hover:bg-slate-800/30 transition-colors">
                            <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3 bg-white/5">
                                <Icon className="text-indigo-400" size={20} />
                                <h3 className="font-bold text-slate-200">{rule.title}</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-400 mb-6 text-sm leading-relaxed">{rule.content}</p>
                                <ul className="space-y-4">
                                    {rule.items.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-snug">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                 <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-200">ドキュメントテンプレート</h3>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">Must Use</span>
                </div>
                <div className="p-8 grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                         <p className="text-slate-400 leading-relaxed">
                            作成したスクリプトには必ず「使い方」を添付します。
                            <br/><br/>
                            合格ラインは<br/>
                            <span className="text-emerald-400 font-bold border-b border-emerald-500/30">「何も知らない人が、空のシーンから再現できる」</span>
                            ことです。
                        </p>
                        <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <p className="text-xs text-indigo-300 font-medium">💡 Tips</p>
                            <p className="text-xs text-indigo-200/70 mt-1">ドキュメント生成AI機能を使えば、スクリプトからこの形式を自動生成できます。</p>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-30 transition duration-500 blur"></div>
                            <div className="relative bg-[#0B1120] rounded-xl p-6 border border-slate-700/50 overflow-x-auto">
                                <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                                    {DOC_TEMPLATE}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Guidelines;