import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenaiBlob } from "@google/genai";
import { useLocalization } from '../context/LocalizationContext.tsx';
import { Transcription } from '../types.ts';
import CloseIcon from './icons/CloseIcon.tsx';
import MicIcon from './icons/MicIcon.tsx';
import MicOffIcon from './icons/MicOffIcon.tsx';
import PhoneIcon from './icons/PhoneIcon.tsx';

// Helper functions for audio encoding/decoding
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function createBlob(data: Float32Array): GenaiBlob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}


interface LiveChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    const [status, setStatus] = useState<'idle' | 'requesting' | 'connecting' | 'connected' | 'error' | 'closing'>('idle');
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const playingSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');
    const modalRef = useRef<HTMLDivElement>(null);

    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcriptions]);

    useEffect(() => {
        if (isOpen) {
            const modalElement = modalRef.current;
            if (!modalElement) return;

            const focusableElements = modalElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKeyPress = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;
                if (focusableElements.length === 0) return;

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            };
            
            firstElement?.focus();
            modalElement.addEventListener('keydown', handleTabKeyPress);

            return () => {
                modalElement.removeEventListener('keydown', handleTabKeyPress);
            };
        }
    }, [isOpen]);

    const cleanup = useCallback(async () => {
        console.log("Cleaning up resources...");
        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
            sessionPromiseRef.current = null;
        }

        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        sourceNodeRef.current?.disconnect();
        sourceNodeRef.current = null;
        
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
        }
        inputAudioContextRef.current = null;
        
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            playingSourcesRef.current.forEach(source => source.stop());
            playingSourcesRef.current.clear();
            await outputAudioContextRef.current.close();
        }
        outputAudioContextRef.current = null;

        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;

        setStatus('idle');
    }, []);
    
    const handleClose = useCallback(() => {
        setStatus('closing');
        cleanup().then(onClose);
    }, [cleanup, onClose]);

    useEffect(() => {
        if (isOpen) {
            startSession();
        } else {
            if (status !== 'idle') {
                cleanup();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const startSession = async () => {
        if (status !== 'idle' || !process.env.API_KEY) return;
        setStatus('requesting');
        setTranscriptions([]);
        currentInputTranscriptionRef.current = '';
        currentOutputTranscriptionRef.current = '';
        nextStartTimeRef.current = 0;

        try {
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStatus('connecting');

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Setup audio contexts
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Session opened.');
                        setStatus('connected');

                        if (!mediaStreamRef.current || !inputAudioContextRef.current) return;

                        sourceNodeRef.current = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            if (isMuted) return;
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };

                        sourceNodeRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle audio output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            
                            source.addEventListener('ended', () => {
                                playingSourcesRef.current.delete(source);
                            });

                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            playingSourcesRef.current.add(source);
                        }
                        
                        // Handle interruption
                        if (message.serverContent?.interrupted) {
                            playingSourcesRef.current.forEach(source => source.stop());
                            playingSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }

                        // Handle transcriptions
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            const userInput = currentInputTranscriptionRef.current.trim();
                            const modelOutput = currentOutputTranscriptionRef.current.trim();
                            const newTranscripts: Transcription[] = [];
                            if (userInput) newTranscripts.push({ speaker: 'user', text: userInput });
                            if (modelOutput) newTranscripts.push({ speaker: 'model', text: modelOutput });
                            
                            setTranscriptions(prev => [...prev, ...newTranscripts]);

                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setStatus('error');
                        cleanup();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Session closed.');
                        cleanup();
                        onClose();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'You are a friendly and helpful sales expert for NOVATRA, a premium baby furniture store. Keep your answers conversational and concise.',
                },
            });

        } catch (error) {
            console.error("Failed to start session:", error);
            setStatus('error');
            cleanup();
        }
    };
    
    const StatusIndicator = () => {
        let text = '';
        let color = '';
        switch (status) {
            case 'requesting': text = 'מבקש הרשאות...'; color = 'text-gray-500'; break;
            case 'connecting': text = 'מתחבר...'; color = 'text-yellow-500'; break;
            case 'connected': text = 'מחובר'; color = 'text-green-500'; break;
            case 'error': text = 'שגיאה'; color = 'text-red-500'; break;
            case 'closing': text = 'סוגר שיחה...'; color = 'text-gray-500'; break;
            default: return null;
        }
        return <div className={`text-sm ${color}`}>{text}</div>;
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] p-4">
            <div 
                ref={modalRef}
                className="bg-[#F7F5F3] rounded-lg shadow-xl w-full max-w-lg h-[80vh] flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="live-chat-title"
            >
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <h2 id="live-chat-title" className="text-xl font-bold text-[#2C5F5D]">שיחה חיה עם מומחה</h2>
                        <StatusIndicator />
                    </div>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800" aria-label="Close live chat">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden relative">
                    <div className={`w-32 h-32 rounded-full bg-[#A8B5A0] flex items-center justify-center transition-transform duration-200 ${status === 'connected' ? 'animate-pulse' : ''}`}>
                         <PhoneIcon className="w-16 h-16 text-white" />
                    </div>
                    <p className="mt-4 text-gray-600">דברו בחופשיות, אני מקשיב.</p>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#F7F5F3] to-transparent p-4 overflow-y-auto">
                        <div className="space-y-2">
                            {transcriptions.map((t, i) => (
                                <p key={i} className={t.speaker === 'user' ? 'text-right text-gray-700' : 'text-left text-[#2C5F5D] font-semibold'}>
                                    {t.speaker === 'user' ? 'אתה: ' : 'מומחה: '} {t.text}
                                </p>
                            ))}
                            <div ref={transcriptEndRef} />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white/50 border-t border-gray-200 flex justify-center items-center gap-6">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-gray-400 text-white' : 'bg-green-500 text-white'}`}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <MicOffIcon className="w-6 h-6"/> : <MicIcon className="w-6 h-6"/>}
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600"
                        aria-label="End call"
                    >
                        <PhoneIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveChatModal;