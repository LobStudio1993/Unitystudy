import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import { Bot, User, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageBubbleProps {
    message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
    const isUser = message.role === MessageRole.USER;

    return (
        <div className={`group flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                isUser 
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white' 
                    : 'bg-slate-800 border border-slate-700 text-emerald-400'
            }`}>
                {isUser ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-6 py-4 shadow-md ${
                isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/80 backdrop-blur border border-slate-700/50 text-slate-200 rounded-tl-none'
            }`}>
                <div className={`prose prose-invert prose-sm max-w-none ${
                    isUser ? 'prose-p:text-indigo-50 prose-headings:text-white' : 'prose-p:text-slate-300 prose-headings:text-slate-100'
                }`}>
                    <ReactMarkdown
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 border-b border-slate-700 pb-1" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold mt-4 mb-2 text-emerald-400" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                            code({node, inline, className, children, ...props}: any) {
                                return !inline ? (
                                    <div className="relative group/code my-3">
                                        <div className="absolute -inset-2 bg-slate-950/50 rounded-lg -z-10" />
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-t-lg border border-slate-700 border-b-0">
                                            <Terminal size={12} className="text-slate-500" />
                                            <span className="text-[10px] text-slate-500 font-mono">Code Block</span>
                                        </div>
                                        <pre className="bg-[#0B1120] p-4 rounded-b-lg rounded-tr-lg overflow-x-auto border border-slate-700">
                                            <code {...props} className="text-xs font-mono text-emerald-300 leading-relaxed">
                                                {children}
                                            </code>
                                        </pre>
                                    </div>
                                ) : (
                                    <code {...props} className="bg-slate-950/50 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs border border-indigo-500/20">
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {message.text}
                    </ReactMarkdown>
                </div>
                <div className={`mt-2 text-[10px] font-medium opacity-60 text-right ${isUser ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

export default ChatMessageBubble;