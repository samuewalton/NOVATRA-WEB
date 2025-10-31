
import React, { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';
import ChatWidget from './ChatWidget.tsx';
import ChatBubbleIcon from './icons/ChatBubbleIcon.tsx';

const UnifiedAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useLocalization();

    const isRtl = language === 'he';

    return (
        <>
            <div className={`fixed bottom-4 ${isRtl ? 'left-4 md:left-8' : 'right-4 md:right-8'} z-40 print:hidden`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Open chat assistant"
                    className="bg-[#2C5F5D] text-white rounded-full shadow-lg flex items-center gap-2 px-4 py-3 hover:bg-[#D4896C] transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    <ChatBubbleIcon className="w-6 h-6" />
                    <span className="font-semibold hidden sm:inline">Rani</span>
                </button>
            </div>
            <ChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default UnifiedAssistant;
