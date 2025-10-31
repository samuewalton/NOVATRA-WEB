import React from 'react';
import { LocalizationProvider } from './context/LocalizationContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { ProductProvider } from './context/ProductContext.tsx';
import { RouterProvider, useRouter } from './context/RouterContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ChatProvider } from './context/ChatContext.tsx';
import { ReviewProvider } from './context/ReviewContext.tsx';

import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import ProductPageWrapper from './pages/ProductPageWrapper.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import WishlistPage from './pages/WishlistPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import CatalogPage from './pages/CatalogPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import ProductForm from './components/ProductForm.tsx';
import NotificationContainer from './components/NotificationContainer.tsx';
import UnifiedAssistant from './components/UnifiedAssistant.tsx';
import MobileBottomNav from './components/MobileBottomNav.tsx';
import ShippingPage from './pages/ShippingPage.tsx';
import ReturnsPage from './pages/ReturnsPage.tsx';

const PageRenderer: React.FC = () => {
    const { route, params } = useRouter();

    const renderPage = () => {
        switch (route) {
            case 'product':
                return <ProductPageWrapper productId={params.productId} />;
            case 'checkout':
                return <CheckoutPage />;
            case 'wishlist':
                return <WishlistPage />;
            case 'about':
                return <AboutPage />;
            case 'contact':
                return <ContactPage />;
            case 'catalog':
                return <CatalogPage />;
            case 'shipping':
                return <ShippingPage />;
            case 'returns':
                return <ReturnsPage />;
            case 'admin':
                return <AdminPage />;
            case 'admin-edit':
                 return <ProductForm productId={params.productId} />;
            case 'home':
            default:
                return <HomePage />;
        }
    };
    
    const isAdminRoute = route === 'admin' || route === 'admin-edit';

    return (
        <div className={`flex flex-col min-h-screen ${!isAdminRoute && 'pb-16 md:pb-0'}`}>
            {!isAdminRoute && <Header />}
            <main className={`flex-grow ${!isAdminRoute && 'pt-20'}`}>
                {renderPage()}
            </main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <UnifiedAssistant />}
           {!isAdminRoute &&  <MobileBottomNav />}
        </div>
    );
}


const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <NotificationProvider>
        <ReviewProvider>
            <ProductProvider>
                <WishlistProvider>
                    <CartProvider>
                        <ChatProvider>
                            <RouterProvider>
                                <PageRenderer />
                                <NotificationContainer />
                            </RouterProvider>
                        </ChatProvider>
                    </CartProvider>
                </WishlistProvider>
            </ProductProvider>
        </ReviewProvider>
      </NotificationProvider>
    </LocalizationProvider>
  );
};

export default App;