
import React, { createContext, useState, useContext, ReactNode, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, GenerateContentResponse } from "@google/genai";
import type { ChatMessage, Product, Color, Accessory } from '../types.ts';
import { useProducts } from './ProductContext.tsx';
import { useCart } from './CartContext.tsx';
import { useLocalization } from './LocalizationContext.tsx';

// Check if API key is configured
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ Gemini API key not configured for Chat!");
    console.error("Please create a .env.local file and add: GEMINI_API_KEY=your_key_here");
    console.error("Chat assistant will not function without an API key.");
}

const functionDeclarations: FunctionDeclaration[] = [
    {
      name: "searchProducts",
      description: "Search for products by category, price range, or keywords",
      parameters: {
        type: Type.OBJECT,
        properties: {
            category: { type: Type.STRING, description: "Optional. Product category (e.g., 'Baby Cribs', 'Wardrobes', 'Dressers')." },
            minPrice: { type: Type.NUMBER, description: "Optional. The minimum price for the product search." },
            maxPrice: { type: Type.NUMBER, description: "Optional. The maximum price for the product search." },
            keywords: { type: Type.STRING, description: "Optional. Keywords to search for in product name or description." }
        },
        propertyOrdering: ["category", "minPrice", "maxPrice", "keywords"],
      }
    },
    {
        name: "getProductDetails",
        description: "Get full details of a specific product using its ID or SKU.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                productId: { type: Type.STRING, description: "The ID or SKU of the product." }
            },
            required: ["productId"]
        }
    },
    {
        name: "addToCart",
        description: "Add a product to the user's shopping cart.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                productId: { type: Type.STRING, description: "The ID or SKU of the product to add." },
                quantity: { type: Type.NUMBER, description: "The quantity to add. Defaults to 1." },
                color: { type: Type.STRING, description: "The selected color for the product, if applicable." },
                accessories: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of accessory IDs to add with the product."}
            },
            required: ["productId"]
        }
    },
    {
        name: "getCart",
        description: "Get the current contents of the user's shopping cart.",
        parameters: { type: Type.OBJECT, properties: {} }
    }
];


interface ChatContextType {
    messages: ChatMessage[];
    sendMessage: (text: string) => Promise<void>;
    isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);

    const { products, getProductById } = useProducts();
    const { cart, addToCart, getCartItemDetails, totalPrice } = useCart();
    const { language } = useLocalization();

    const getChat = useCallback(() => {
        if (!chatRef.current) {
            if (!apiKey) {
                throw new Error("Gemini API key not configured. Please check your .env.local file.");
            }
            const ai = new GoogleGenAI({ apiKey });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-pro',
                config: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                    systemInstruction: `You are Rani, the friendly shopping assistant for NOVATRA - official Veres baby furniture importer in Israel.

Your role:
- Help parents choose the perfect furniture for their baby/child
- Answer questions about products (dimensions, materials, safety, assembly)
- Provide recommendations based on age, budget, room size, style preferences
- Assist with the purchasing process
- Speak naturally in Hebrew, English, or Russian (match user's language)

You have access to functions to:
- Search products by criteria
- Get product details
- Add items to cart
- Check current cart contents

Always be warm, professional, and helpful. Focus on safety and quality.`,
                    tools: [{ functionDeclarations }]
                },
                history: []
            });
        }
        return chatRef.current;
    }, []);
    
    // Function implementations
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

        const chat = getChat();

        try {
            let response = await chat.sendMessage({ message: text });

            while (response.functionCalls && response.functionCalls.length > 0) {
                const toolResponses = [];
                for (const fc of response.functionCalls) {
                    const { name, args } = fc;
                    if (toolFunctions[name as keyof typeof toolFunctions]) {
                        // @ts-ignore
                        const result = toolFunctions[name](args);
                        toolResponses.push({
                            id: fc.id,
                            name: fc.name,
                            response: { result }
                        });
                    }
                }
                
                response = await chat.sendMessage({ toolResponses });
            }

            const modelResponse: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response.text };
            setMessages(prev => [...prev, modelResponse]);

        } catch (error) {
            console.error("Gemini API error:", error);
            let errorText = "I'm sorry, I encountered an error. Please try again.";

            if (error instanceof Error) {
                console.error("Error details:", error.message);

                // Provide more helpful error messages
                if (error.message.includes("API key")) {
                    errorText = "Configuration error: API key is not set up correctly. Please contact support.";
                } else if (error.message.includes("quota") || error.message.includes("429")) {
                    errorText = "I'm experiencing high demand right now. Please try again in a moment.";
                } else if (error.message.includes("network") || error.message.includes("fetch")) {
                    errorText = "Network connection issue. Please check your internet and try again.";
                }
            }

            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: errorText
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
