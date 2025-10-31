import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext.tsx';
import { useLocalization } from '../context/LocalizationContext.tsx';
import CloseIcon from './icons/CloseIcon.tsx';
import SendIcon from './icons/SendIcon.tsx';
import AttachmentIcon from './icons/AttachmentIcon.tsx';

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
    const { messages, sendMessage, isLoading } = useChat();
    const { t, language } = useLocalization();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            const widgetElement = widgetRef.current;
            if (!widgetElement) return;

            const focusableElements = widgetElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            const handleTabKeyPress = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;

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
            
            widgetElement.querySelector('input')?.focus();
            widgetElement.addEventListener('keydown', handleTabKeyPress);

            return () => {
                widgetElement.removeEventListener('keydown', handleTabKeyPress);
            };
        }
    }, [isOpen, messages, isLoading]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input.trim());
            setInput('');
        }
    };
    
    const isRtl = language === 'he';
    const widgetPosition = isRtl ? 'left-4 md:left-8' : 'right-4 md:right-8';

    if (!isOpen) return null;

    return (
        <div
            ref={widgetRef}
            className={`fixed bottom-0 left-0 right-0 top-0 md:top-auto md:bottom-20 ${widgetPosition} z-50 flex flex-col bg-white shadow-2xl rounded-t-lg md:rounded-lg w-full h-full md:h-[500px] md:w-[350px] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-widget-title"
        >
            {/* Header */}
            <header className="flex items-center justify-between p-3 border-b bg-[#F7F5F3] rounded-t-lg">
                <h2 id="chat-widget-title" className="text-lg font-bold text-[#2C5F5D]">{t('rani_title')}</h2>
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close chat">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-teal-100 text-gray-800'}`}>
                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="max-w-xs p-3 rounded-lg bg-teal-100 text-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <footer className="p-3 border-t bg-white rounded-b-lg">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('rani_placeholder')}
                        className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#A8B5A0]"
                        disabled={isLoading}
                    />
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700" aria-label="Attach file">
                        <AttachmentIcon className="w-6 h-6" />
                    </button>
                     <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 rounded-full bg-[#2C5F5D] text-white disabled:bg-gray-400 hover:bg-[#D4896C] transition-colors"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatWidget;