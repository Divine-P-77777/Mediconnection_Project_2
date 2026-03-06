"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Mic, MicOff, Volume2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveVoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (text: string) => Promise<string>;
}

export default function LiveVoiceModal({
    isOpen,
    onClose,
    onSend,
}: LiveVoiceModalProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [status, setStatus] = useState("Tap mic to start");
    const [language, setLanguage] = useState<"en-IN" | "hi-IN">("en-IN");

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true; // Keep listening until silence
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = language;

                recognitionRef.current.onstart = () => {
                    setIsListening(true);
                    setStatus("Listening...");
                };

                recognitionRef.current.onresult = (event: any) => {
                    // Clear existing timer on any sound/result
                    if (silenceTimer.current) clearTimeout(silenceTimer.current);

                    const current = event.resultIndex;
                    const transcriptText = Array.from(event.results)
                        .slice(current)
                        .map((result: any) => result[0].transcript)
                        .join("");

                    // Update UI with live transcript
                    setTranscript(transcriptText);

                    // Set 2s silence timer
                    silenceTimer.current = setTimeout(() => {
                        recognitionRef.current.stop();
                    }, 2000);
                };

                recognitionRef.current.onend = async () => {
                    if (silenceTimer.current) clearTimeout(silenceTimer.current);
                    setIsListening(false);
                };
            }
            synthRef.current = window.speechSynthesis;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (synthRef.current) synthRef.current.cancel();
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
        };
    }, [language]);

    // Effect to trigger send when listening stops and we have text
    useEffect(() => {
        const process = async () => {
            if (!isListening && transcript.trim()) {
                setStatus("Thinking...");
                await handleProcessInput(transcript);
            }
        };
        process();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening]);

    const handleProcessInput = async (text: string) => {
        if (!text.trim()) return;
        // ... rest stays same, but reset transcript after sending is safer in 'speak' or here
        try {
            const responseText = await onSend(text);
            setStatus("Speaking...");
            speak(responseText);
        } catch (e) {
            setStatus("Error processing request");
        }
    };

    const speak = (text: string) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            setStatus("Tap mic to reply");
            setTranscript("");
        };

        synthRef.current.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (isSpeaking) {
                synthRef.current?.cancel();
                setIsSpeaking(false);
            }
            setTranscript("");
            recognitionRef.current?.start();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-white backdrop-blur-3xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                    <X size={24} />
                </button>

                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg space-y-12">

                    {/* Status & Transcript */}
                    <div className="text-center space-y-4 min-h-[100px]">
                        <h2 className="text-2xl font-light tracking-wide opacity-80">{status}</h2>
                        {transcript && (
                            <p className="text-lg font-medium text-blue-200 leading-relaxed max-w-md mx-auto">
                                "{transcript}"
                            </p>
                        )}
                    </div>

                    {/* Orb Animation */}
                    <div className="relative flex items-center justify-center">
                        <div className={`w-32 h-32 rounded-full blur-3xl transition-all duration-500 ${isListening ? "bg-blue-500 scale-150 animate-pulse" :
                            isSpeaking ? "bg-purple-500 scale-125 animate-pulse" : "bg-slate-700 scale-100"
                            }`} />

                        <div className={`absolute inset-0 rounded-full border border-white/10 transition-all duration-300 ${isListening ? "scale-125 border-blue-400/30" : "scale-100"}`} />

                        <button
                            onClick={toggleListening}
                            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${isListening ? "bg-white text-blue-600 scale-110" :
                                isSpeaking ? "bg-white text-purple-600" :
                                    "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white hover:scale-105"
                                }`}
                        >
                            {isSpeaking ? <Volume2 size={32} /> : isListening ? <Mic size={32} /> : <MicOff size={32} />}
                        </button>
                    </div>

                </div>

                {/* Controls */}
                <div className="absolute bottom-10 flex items-center gap-4 bg-white/5 rounded-full p-2 border border-white/10">
                    <button
                        onClick={() => setLanguage("en-IN")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${language === "en-IN" ? "bg-white text-black" : "text-slate-400 hover:text-white"}`}
                    >
                        English
                    </button>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <button
                        onClick={() => setLanguage("hi-IN")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${language === "hi-IN" ? "bg-white text-black" : "text-slate-400 hover:text-white"}`}
                    >
                        Hindi/Local
                    </button>
                </div>

            </motion.div>
        </AnimatePresence>
    );
}
