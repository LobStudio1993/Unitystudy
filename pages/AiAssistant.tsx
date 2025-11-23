import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Send, Eraser, Loader2, Sparkles, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import ChatMessageBubble from '../components/ChatMessageBubble';
import { chatWithGemini } from '../services/geminiService';

interface AiAssistantProps {
    mode: 'general' | 'review' | 'docs' | 'spec';
}

const AiAssistant: React.FC<AiAssistantProps> = ({ mode }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial greeting based on mode
    useEffect(() => {
        let greeting = "";
        switch (mode) {
            case 'review':
                greeting = "### ⚡ Code Reviewer Mode\nUnityコードレビューを開始します。\nスクリプトを貼り付けてください。\n\n**チェック項目**:\n- 命名規則 (PascalCase / camelCase)\n- [SerializeField] の使用\n- Update内のパフォーマンス";
                break;
            case 'docs':
                greeting = "### 📄 Doc Generator Mode\nドキュメント生成モードです。\nスクリプトを送信すれば、「空のシーンから検証できる手順書」を作成します。";
                break;
            case 'spec':
                greeting = "### 🖊️ Spec Designer Mode\n仕様書相談へようこそ。\n実装したい機能やゲームのルールについて話してください。\n\n**できること**:\n- ふわっとしたアイデアの具体化\n- エッジケース（想定外の挙動）の洗い出し\n- プログラマーに伝わる仕様書フォーマットへの整理";
                break;
            default:
                greeting = "### 💬 Technical Mentor\nUnity技術相談へようこそ。\n実装の悩みやエラーについて教えてください。\n*※答えを教えるのではなく、解決へのヒントを提示します。*";
                break;
        }

        setMessages([{
            id: 'init',
            role: MessageRole.MODEL,
            text: greeting,
            timestamp: Date.now()
        }]);
    }, [mode]);

    // 安全なスクロール処理
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const { scrollHeight, clientHeight } = chatContainerRef.current;
            // 即座に最下部へ移動（アニメーションなしでズレを防ぐ）
            chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };

    // リサイズとスクロールを同期させる
    useLayoutEffect(() => {
        // 1. 先にテキストエリアの高さを確定させる
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }

        // 2. レイアウト確定後にスクロール位置を調整する
        scrollToBottom();
    }, [input, messages, isLoading, selectedImage]);

    // ウィンドウサイズ変更（モバイルキーボード出現など）時にもスクロール調整
    useEffect(() => {
        const handleResize = () => scrollToBottom();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validating image types (basic)
        if (!file.type.startsWith('image/')) {
            alert('画像ファイルのみ選択可能です。');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setSelectedImage(base64String);
        };
        reader.readAsDataURL(file);
        
        // Reset input value so the same file can be selected again if needed
        e.target.value = '';
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        // 現在の入力を退避してからクリアする（非同期処理中のstate参照エラー防止）
        const currentInput = input;
        const currentImage = selectedImage;
        
        setInput('');
        setSelectedImage(null);
        
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: MessageRole.USER,
            text: currentInput,
            image: currentImage || undefined,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const responseText = await chatWithGemini(currentInput, mode, currentImage || undefined);
            
            const modelMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: MessageRole.MODEL,
                text: responseText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // IME入力中（日本語変換中）のEnterキーは無視する
        if (e.nativeEvent.isComposing) return;

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages(prev => [prev[0]]); // Keep initial greeting
        setInput('');
        setSelectedImage(null);
    };

    // Header styling based on mode
    const getHeaderStyle = () => {
        switch (mode) {
            case 'review': return 'bg-pink-500/20 text-pink-400';
            case 'docs': return 'bg-emerald-500/20 text-emerald-400';
            case 'spec': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-indigo-500/20 text-indigo-400';
        }
    };

    const getTitle = () => {
        switch (mode) {
            case 'review': return 'Code Reviewer';
            case 'docs': return 'Doc Generator';
            case 'spec': return 'Spec Designer';
            default: return 'Technical Mentor';
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0B1120]/40 backdrop-blur-sm rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl relative">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getHeaderStyle()}`}>
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-100">
                            {getTitle()}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-mono">
                            Powered by Gemini 2.5 Flash & 3.0 Pro
                        </p>
                    </div>
                </div>
                <button 
                    onClick={clearChat}
                    title="Reset Session"
                    className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
                >
                    <Eraser size={14} />
                    <span className="hidden sm:inline">Reset</span>
                </button>
            </div>

            {/* Chat Area */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 pt-20 space-y-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
                style={{ scrollBehavior: 'auto' }} // アニメーションを無効化して即応性を高める
            >
                {messages.map((msg) => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                     <div className="flex gap-4 animate-in fade-in duration-300">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <Loader2 size={16} className="text-indigo-400 animate-spin" />
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl rounded-tl-none px-5 py-3 border border-slate-700/50">
                            <div className="flex gap-1 h-4 items-center">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                     </div>
                )}
                {/* Spacer (Expanded) to prevent content from being hidden behind input area */}
                <div className="h-10 shrink-0" />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 pt-2 bg-gradient-to-t from-[#0B1120] to-transparent z-20 shrink-0">
                <div className="relative max-w-4xl mx-auto bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl transition-shadow focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)] focus-within:border-indigo-500/30 overflow-hidden">
                    
                    {/* Image Preview Area */}
                    {selectedImage && (
                        <div className="px-4 pt-4 pb-2 flex items-start animate-in slide-in-from-bottom-2 fade-in duration-200">
                            <div className="relative group/preview inline-block">
                                <img 
                                    src={selectedImage} 
                                    alt="Preview" 
                                    className="h-20 w-auto rounded-lg border border-slate-600 object-cover shadow-lg"
                                />
                                <button 
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 border border-slate-500 shadow-sm hover:bg-rose-500 hover:border-rose-400 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-end p-2">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-3 rounded-xl transition-colors shrink-0 ${
                                selectedImage 
                                ? 'text-indigo-400 bg-indigo-500/10' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                            title="画像を添付"
                        >
                            {selectedImage ? <ImageIcon size={20} /> : <Paperclip size={20} />}
                        </button>
                        
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder={
                                mode === 'review' ? "レビューしたいコードを貼り付けてください..." : 
                                mode === 'spec' ? "実現したい仕様やアイデアを入力..." :
                                "Unityの質問を入力 (Shift+Enterで改行)"
                            }
                            className="w-full bg-transparent text-slate-200 px-3 py-3 text-sm focus:outline-none resize-none max-h-[200px] scrollbar-thin placeholder:text-slate-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || (!input.trim() && !selectedImage)}
                            className={`p-3 rounded-xl transition-all duration-200 shrink-0 ${
                                (input.trim() || selectedImage) && !isLoading 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25' 
                                : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 text-center font-medium">
                    AI can make mistakes. Please verify generated code in your Unity environment.
                </p>
            </div>
        </div>
    );
};

export default AiAssistant;