import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

// FIX: Export Route type to be used in other components.
export type Route = 'home' | 'product' | 'checkout' | 'wishlist' | 'catalog' | 'about' | 'contact' | 'admin' | 'admin-edit' | 'shipping' | 'returns';
type RouteParams = Record<string, string>;

interface RouterContextType {
    route: Route;
    params: RouteParams;
    navigateTo: (route: Route, params?: RouteParams) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

const validRoutes: Route[] = ['home', 'product', 'checkout', 'wishlist', 'catalog', 'about', 'contact', 'admin', 'admin-edit', 'shipping', 'returns'];

const parseHash = (): { route: Route, params: RouteParams } => {
    const hash = window.location.hash.slice(1);
    if (!hash) return { route: 'home', params: {} };

    const [path, query] = hash.split('?');
    const params: RouteParams = {};

    if (query) {
        const queryParams = new URLSearchParams(query);
        queryParams.forEach((value, key) => {
            params[key] = value;
        });
    }

    // New path parsing for admin routes like /admin/edit/1
    const pathSegments = path.split('/');
    let route: Route = 'home';
    
    if (pathSegments[0] === 'admin') {
        if (pathSegments[1] === 'edit' && pathSegments[2]) {
             route = 'admin-edit';
             params.productId = pathSegments[2];
        } else {
            route = 'admin';
        }
    } else {
        route = pathSegments[0] as Route;
    }
    
    if (validRoutes.includes(route)) {
        return { route, params };
    }
    
    // Fallback for product URLs that might still use the old query param format
    if (params.productId) {
         return { route: 'product', params };
    }
    
    return { route: 'home', params: {} };
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [location, setLocation] = useState(parseHash());

    useEffect(() => {
        const handleHashChange = () => {
            setLocation(parseHash());
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateTo = useCallback((route: Route, params: RouteParams = {}) => {
        let path = route;
        let queryParams = { ...params };

        if (route === 'admin-edit' && params.productId) {
            path = `admin/edit/${params.productId}` as Route;
            delete queryParams.productId;
        } else if (route === 'product' && params.productId) {
            path = 'product' as Route;
            // keep productId in query for product page
        }

        let newHash = `#${path}`;
        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value) {
                searchParams.set(key, value);
            }
        });

        const queryString = searchParams.toString();
        if (queryString) {
            newHash += `?${queryString}`;
        }

        if (window.location.hash !== newHash) {
            window.location.hash = newHash;
        } else {
            setLocation(parseHash());
        }
    }, []);
    
    const value = useMemo(() => ({ ...location, navigateTo }), [location, navigateTo]);

    return (
        <RouterContext.Provider value={value}>
            {children}
        </RouterContext.Provider>
    );
};

export const useRouter = (): RouterContextType => {
    const context = useContext(RouterContext);
    if (context === undefined) {
        throw new Error('useRouter must be used within a RouterProvider');
    }
    return context;
};
