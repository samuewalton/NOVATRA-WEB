
import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { translations } from '../data/translations.ts';
import { Language } from '../types.ts';

interface LocalizationContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(Language.HE);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === Language.HE ? 'rtl' : 'ltr';
    }, [language]);

    const t = useCallback((key: string): string => {
        return translations[key]?.[language] || key;
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

    return (
        <LocalizationContext.Provider value={value}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = (): LocalizationContextType => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};