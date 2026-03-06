"use client";

import React, {
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    useCallback,
} from "react";
import {
    Send,
    Bot,
    User,
    Sparkles,
    Loader2,
    ArrowLeft,
    Mic,
    Sun,
    Moon,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import LiveVoiceModal from "./LiveVoiceModal";
import { toggleDarkMode } from "@/store/themeSlice";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const MAX_CONTEXT_MESSAGES = 8;

const ChatPage = () => {
    const router = useRouter();
    const isDarkMode = useAppSelector((s) => s.theme.isDarkMode);
    const dispatch = useAppDispatch();

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "**Hello! 👋**\n\nI'm your **health assistant AI**.\n\nDescribe your symptoms and I’ll help you analyze them.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLiveOpen, setIsLiveOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLiveOpen) inputRef.current?.focus();
    }, [isLiveOpen]);

    useLayoutEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input.trim() };

        setInput("");
        setIsLoading(true);
        setMessages((prev) => [...prev, userMessage]);

        try {
            const context = [...messages, userMessage].slice(-MAX_CONTEXT_MESSAGES);
            const response = await axios.post("/api/chat", { messages: context });

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.data.content },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "⚠️ **Connection issue**\n\nPlease try again in a moment.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages]);

    const handleVoiceSend = async (text: string): Promise<string> => {
        const userMessage: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const context = [...messages, userMessage].slice(-MAX_CONTEXT_MESSAGES);
            const response = await axios.post("/api/chat", { messages: context });
            const botText = response.data.content;

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: botText },
            ]);

            return botText;
        } catch {
            const errorText = "**Sorry**, voice connection failed.";
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: errorText },
            ]);
            return errorText;
        }
    };

    return (
        <div
            className={`h-[100dvh] flex flex-col ${isDarkMode
                ? "bg-[#0A192F] text-slate-100"
                : "bg-slate-50 text-slate-800"
                }`}
        >
            <LiveVoiceModal
                isOpen={isLiveOpen}
                onClose={() => setIsLiveOpen(false)}
                onSend={handleVoiceSend}
            />

            {/* HEADER */}
            <div
                className={`border-b px-4 py-3 flex items-center justify-between ${isDarkMode
                    ? "border-slate-700 bg-[#0A192F]"
                    : "border-slate-200 bg-white"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/user")}>
                        <ArrowLeft size={18} />
                    </button>

                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                        <Sparkles size={16} />
                    </div>

                    <div>
                        <h1 className="text-sm font-semibold">AI Health Assistant</h1>
                        <p className="text-[11px] opacity-70">
                            Powered by Gemini & MedModel
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLiveOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium animate-pulse"
                    >
                        <Mic size={14} />
                        Live Mode
                    </button>

                    <button onClick={() => dispatch(toggleDarkMode())}>
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>

            {/* CHAT */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${msg.role === "user"
                                    ? "bg-slate-700"
                                    : "bg-gradient-to-tr from-teal-400 to-cyan-500"
                                    }`}
                            >
                                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                            </div>

                            <div
                                className={`px-4 py-3 rounded-2xl text-sm shadow-sm markdown ${msg.role === "user"
                                    ? "bg-slate-800 text-white rounded-br-none"
                                    : isDarkMode
                                        ? "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none"
                                        : "bg-white text-slate-700 border rounded-bl-none"
                                    }`}
                            >
                                {msg.role === "assistant" ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-2 items-center">
                        <Loader2 className="animate-spin" size={16} />
                        <span className="text-xs opacity-70">Thinking…</span>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* FOOTER */}
            <div
                className={`border-t px-3 py-3 ${isDarkMode
                    ? "border-slate-700 bg-[#0A192F]"
                    : "border-slate-200 bg-white"
                    }`}
            >
                <div
                    className={`flex items-center gap-2 rounded-xl border px-2 ${isDarkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                        }`}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        className={`flex-1 px-3 py-3 text-sm bg-transparent outline-none ${isDarkMode ? "text-white placeholder:text-white" : "text-slate-700 placeholder:text-slate-700"}`}
                        placeholder="Describe your symptoms..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-3 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </div>

                <p className="text-[10px] text-center opacity-60 mt-1">
                    AI can make mistakes. Consult a doctor for medical advice.
                </p>
            </div>
        </div>
    );
};

export default ChatPage;
