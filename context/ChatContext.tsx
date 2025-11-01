
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { ChatMessage, Product, Color, Accessory } from '../types.ts';
import { useProducts } from './ProductContext.tsx';
import { useCart } from './CartContext.tsx';
import { useLocalization } from './LocalizationContext.tsx';

// Chat now uses Vercel API route /api/gemini-chat
// All Gemini SDK calls are server-side for API key security

interface ChatContextType {
    messages: ChatMessage[];
    sendMessage: (text: string) => Promise<void>;
    isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { products, getProductById } = useProducts();
    const { cart, addToCart, getCartItemDetails, totalPrice } = useCart();
    const { language } = useLocalization();

    // Function implementations for tool calling (executed client-side after server responds)
    const toolFunctions = {
        searchProducts: ({ category, minPrice, maxPrice, keywords }: { category?: string; minPrice?: number; maxPrice?: number; keywords?: string }) => {
            let filtered = [...products];

            if (category) {
                filtered = filtered.filter(p => Object.values(p.category).some(c => c.toLowerCase().includes(category.toLowerCase())));
            }
            if (minPrice) {
                filtered = filtered.filter(p => p.price.ils >= minPrice);
            }
            if (maxPrice) {
                filtered = filtered.filter(p => p.price.ils <= maxPrice);
            }
            if (keywords) {
                const search = keywords.toLowerCase();
                filtered = filtered.filter(p =>
                    Object.values(p.name).some(n => n.toLowerCase().includes(search)) ||
                    Object.values(p.description).some(d => d.toLowerCase().includes(search))
                );
            }

            if (filtered.length === 0) {
                return "No products found matching the criteria.";
            }

            const results = filtered.map(p => ({
                id: p.id,
                sku: p.sku,
                name: p.name[language],
                price: p.price.ils,
                image: p.images[0]
            }));

            return JSON.stringify(results);
        },
        getProductDetails: ({ productId }: { productId: string }) => {
            const product = products.find(p => p.id === productId || p.sku === productId);
            return product ? JSON.stringify(product) : `Product with ID/SKU '${productId}' not found.`;
        },
        addToCart: ({ productId, quantity = 1, color, accessories = [] }: { productId: string; quantity?: number; color?: string; accessories?: string[] }) => {
            const product = products.find(p => p.id === productId || p.sku === productId);
            if (!product) {
                return `Product with ID/SKU '${productId}' not found. Cannot add to cart.`;
            }

            let selectedColor: Color | undefined = product.colors[0];
            if (color) {
                 selectedColor = product.colors.find(c => Object.values(c.name).some(name => name.toLowerCase() === color.toLowerCase()));
                 if (!selectedColor) return `Color '${color}' not found for this product. Available colors are: ${product.colors.map(c => c.name[language]).join(', ')}.`;
            }
            if (!selectedColor) {
                 return "This product requires a color selection.";
            }

            const selectedAccessories: Accessory[] = [];
            for (const accId of accessories) {
                const foundAcc = product.accessories.find(a => a.id === accId);
                if (foundAcc) selectedAccessories.push(foundAcc);
                else return `Accessory with ID '${accId}' not found for this product.`;
            }

            addToCart(product.id, quantity, selectedColor, selectedAccessories);

            return JSON.stringify({ success: true, message: `${product.name[language]} was added to your cart.`, cartTotal: totalPrice });
        },
        getCart: () => {
            if (cart.length === 0) {
                return "The shopping cart is currently empty.";
            }
            const cartDetails = cart.map(item => {
                const { product } = getCartItemDetails(item);
                return {
                    name: product?.name[language],
                    quantity: item.quantity,
                    color: item.color.name[language],
                    accessories: item.accessories.map(a => a.name[language]),
                    price: product?.price.ils
                }
            });
            return JSON.stringify({ items: cartDetails, total: totalPrice });
        }
    };

    const sendMessage = async (text: string) => {
        setIsLoading(true);
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text };
        setMessages(prev => [...prev, userMessage]);

        try {
            // Convert messages to API format (excluding current message since we send it separately)
            const history = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            const response = await fetch('/api/gemini-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();

            // Handle function calls if present
            if (data.functionCalls && data.functionCalls.length > 0) {
                console.log('Function calls from server:', data.functionCalls);
                // TODO: Execute functions client-side and send results back
                // This will be implemented in a future iteration
            }

            const modelResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: data.text || "I'm sorry, I couldn't generate a response."
            };
            setMessages(prev => [...prev, modelResponse]);

        } catch (error) {
            console.error("Chat API error:", error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "I'm sorry, I encountered an error. Please try again."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const value = { messages, sendMessage, isLoading };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
