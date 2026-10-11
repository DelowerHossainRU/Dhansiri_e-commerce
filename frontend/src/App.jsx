import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ShopPage } from './pages/shop/ShopPage';
import { ProductDetailPage } from './pages/shop/ProductDetailPage';
import { CheckoutPage } from './pages/shop/CheckoutPage';
import { TrackOrderPage } from './pages/public/TrackOrderPage';
import { QualityPage } from './pages/public/QualityPage';
import { SourcingPage } from './pages/public/SourcingPage';
import { AboutPage } from './pages/public/AboutPage';
import { DistributorPage } from './pages/public/DistributorPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import { TermsPage, PrivacyPolicyPage, ReturnsPolicyPage, ShippingPolicyPage } from './pages/public/LegalPages';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Agricultural Specialty Pages
import { SeasonalPage } from './pages/public/SeasonalPage';
import { FreshHarvestPage } from './pages/public/FreshHarvestPage';
import { FarmerNetworkPage } from './pages/public/FarmerNetworkPage';
import { QuotationRequestPage } from './pages/public/QuotationRequestPage';
import { DeliveryInfoPage } from './pages/public/DeliveryInfoPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';

// Customer & B2B Pages
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { AccountDashboardPage } from './pages/customer/AccountDashboardPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { WholesalePortalPage } from './pages/wholesale/WholesalePortalPage';
import { WholesaleDashboardPage } from './pages/wholesale/WholesaleDashboardPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminPurchasesPage } from './pages/admin/AdminPurchasesPage';
import { AdminSuppliersPage } from './pages/admin/AdminSuppliersPage';
import { AdminFarmersPage } from './pages/admin/AdminFarmersPage';
import { AdminQualityPage } from './pages/admin/AdminQualityPage';
import { AdminWholesalePage } from './pages/admin/AdminWholesalePage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <WishlistProvider>
                <Routes>
                  {/* Public Store Routes wrapped in MainLayout */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/products" element={<ShopPage />} />
                    <Route path="/products/:slug" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/track" element={<TrackOrderPage />} />
                    <Route path="/track/:orderNumber" element={<TrackOrderPage />} />
                    <Route path="/quality" element={<QualityPage />} />
                    <Route path="/sourcing" element={<SourcingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/wholesale" element={<WholesalePortalPage />} />
                    <Route path="/quotations/request" element={<QuotationRequestPage />} />
                    <Route path="/seasonal" element={<SeasonalPage />} />
                    <Route path="/fresh-harvest" element={<FreshHarvestPage />} />
                    <Route path="/farmers" element={<FarmerNetworkPage />} />
                    <Route path="/delivery-info" element={<DeliveryInfoPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/distributors" element={<DistributorPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/returns" element={<ReturnsPolicyPage />} />
                    <Route path="/shipping-policy" element={<ShippingPolicyPage />} />

                    {/* Customer Account Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/account" element={<AccountDashboardPage />} />
                    <Route path="/account/orders" element={<AccountDashboardPage />} />
                    <Route path="/account/wishlist" element={<WishlistPage />} />
                    <Route path="/wholesale/dashboard" element={<WholesaleDashboardPage />} />

                    {/* 404 Catch-All */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Enterprise Admin Console Routes wrapped in AdminLayout */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminOverviewPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="inventory" element={<AdminInventoryPage />} />
                    <Route path="purchases" element={<AdminPurchasesPage />} />
                    <Route path="suppliers" element={<AdminSuppliersPage />} />
                    <Route path="farmers" element={<AdminFarmersPage />} />
                    <Route path="quality" element={<AdminQualityPage />} />
                    <Route path="wholesale" element={<AdminWholesalePage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="coupons" element={<AdminCouponsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                    <Route path="audit-logs" element={<AdminAuditLogsPage />} />
                  </Route>
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
