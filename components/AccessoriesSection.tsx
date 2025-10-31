

import React from 'react';
import type { Accessory } from '../types.ts';
import { useLocalization } from '../context/LocalizationContext.tsx';

interface AccessoriesSectionProps {
    accessories: Accessory[];
    selected: Accessory[];
    onToggle: (accessory: Accessory) => void;
}

const AccessoryCard: React.FC<{ accessory: Accessory; isSelected: boolean; onToggle: () => void; }> = ({ accessory, isSelected, onToggle }) => {
    const { language } = useLocalization();
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div 
            onClick={onToggle}
            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-teal-50 border-[#2C5F5D]' : 'bg-white hover:bg-gray-50'}`}
        >
            <img src={accessory.image} alt={accessory.name[language]} className="w-16 h-16 object-cover rounded-md" />
            <div className="flex-1">
                <p className="font-semibold text-gray-800">{accessory.name[language]}</p>
            </div>
            <p className="font-bold text-[#2C5F5D]">{formatPrice(accessory.price.ils)}</p>
            <div className="flex items-center justify-center w-6 h-6 border-2 rounded-md transition-all "
                 style={{
                     backgroundColor: isSelected ? '#2C5F5D' : 'transparent',
                     borderColor: isSelected ? '#2C5F5D' : '#ccc'
                 }}
            >
                {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </div>
    );
};


const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({ accessories, selected, onToggle }) => {
    if (accessories.length === 0) {
        return null;
    }
    
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-[#2C5F5D] mb-8">אביזרים נוספים למוצר זה</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {accessories.map(item => (
                    <AccessoryCard
                        key={item.id}
                        accessory={item}
                        isSelected={selected.some(sel => sel.id === item.id)}
                        onToggle={() => onToggle(item)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AccessoriesSection;