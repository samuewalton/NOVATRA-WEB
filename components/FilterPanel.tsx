import React, { useRef, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext.tsx';
import type { Color } from '../types.ts';
import CloseIcon from './icons/CloseIcon.tsx';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    collections: string[];
    colors: Color[];
    selectedCollections: string[];
    selectedColors: string[]; // hex codes
    onCollectionToggle: (collection: string) => void;
    onColorToggle: (hex: string) => void;
    onClearFilters: () => void;
    isDesktop?: boolean;
}

const FilterPanelContent: React.FC<Omit<FilterPanelProps, 'isOpen' | 'onClose' | 'isDesktop'>> = ({
    collections,
    colors,
    selectedCollections,
    selectedColors,
    onCollectionToggle,
    onColorToggle,
    onClearFilters
}) => {
    const { t, language } = useLocalization();
    const hasActiveFilters = selectedCollections.length > 0 || selectedColors.length > 0;

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Collection Filter */}
                <div>
                    <h3 className="font-semibold mb-3 text-gray-700">{t('collection')}</h3>
                    <div className="space-y-2">
                        {collections.map(collection => (
                            <label key={collection} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedCollections.includes(collection)}
                                    onChange={() => onCollectionToggle(collection)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#2C5F5D] focus:ring-[#A8B5A0]"
                                />
                                <span className="ltr:ml-2 rtl:mr-2 text-gray-600">{collection}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Color Filter */}
                <div>
                    <h3 className="font-semibold mb-3 text-gray-700">{t('color')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {colors.map(color => (
                            <button
                                key={color.hex}
                                onClick={() => onColorToggle(color.hex)}
                                className={`w-8 h-8 rounded-full border-2 ${selectedColors.includes(color.hex) ? 'border-[#2C5F5D] ring-2 ring-offset-1 ring-[#2C5F5D]' : 'border-gray-300'}`}
                                style={{ backgroundColor: color.hex }}
                                aria-label={`Select color ${color.name[language]}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="p-4 border-t">
                <button
                    onClick={onClearFilters}
                    disabled={!hasActiveFilters}
                    className="w-full bg-[#D4896C] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {'נקה סינונים'}
                </button>
            </div>
        </>
    );
}


const FilterPanel: React.FC<FilterPanelProps> = ({
    isOpen,
    onClose,
    isDesktop = false,
    ...props
}) => {
    const { language } = useLocalization();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !isDesktop) {
            const panelElement = panelRef.current;
            if (!panelElement) return;

            const focusableElements = panelElement.querySelectorAll<HTMLElement>(
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
            
            firstElement?.focus();
            panelElement.addEventListener('keydown', handleTabKeyPress);

            return () => {
                panelElement.removeEventListener('keydown', handleTabKeyPress);
            };
        }
    }, [isOpen, isDesktop]);

    if (isDesktop) {
        return (
            <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
                 <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-[#2C5F5D]">{'סינון'}</h2>
                </div>
                <FilterPanelContent {...props} />
            </div>
        )
    }

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div
                ref={panelRef}
                className={`fixed top-0 ${language === 'he' ? 'right-0' : 'left-0'} h-full w-full max-w-xs bg-white shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : (language === 'he' ? 'translate-x-full' : '-translate-x-full')}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-panel-title"
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 id="filter-panel-title" className="text-xl font-bold text-[#2C5F5D]">{'סינון'}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close filters">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <FilterPanelContent {...props} />
                </div>
            </div>
        </>
    );
};

export default FilterPanel;