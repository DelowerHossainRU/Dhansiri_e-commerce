import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PageLoader } from './components/common/PageLoader';

// Layouts (Static for instant shell rendering)
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import('./pages/public/HomePage').then(m => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./pages/shop/ShopPage').then(m => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/shop/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./pages/shop/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const TrackOrderPage = lazy(() => import('./pages/public/TrackOrderPage').then(m => ({ default: m.TrackOrderPage })));
const QualityPage = lazy(() => import('./pages/public/QualityPage').then(m => ({ default: m.QualityPage })));
const SourcingPage = lazy(() => import('./pages/public/SourcingPage').then(m => ({ default: m.SourcingPage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const DistributorPage = lazy(() => import('./pages/public/DistributorPage').then(m => ({ default: m.DistributorPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('./pages/public/FaqPage').then(m => ({ default: m.FaqPage })));
const BlogPage = lazy(() => import('./pages/public/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/public/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const TermsPage = lazy(() => import('./pages/public/LegalPages').then(m => ({ default: m.TermsPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/public/LegalPages').then(m => ({ default: m.PrivacyPolicyPage })));
const ReturnsPolicyPage = lazy(() => import('./pages/public/LegalPages').then(m => ({ default: m.ReturnsPolicyPage })));
const ShippingPolicyPage = lazy(() => import('./pages/public/LegalPages').then(m => ({ default: m.ShippingPolicyPage })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Agricultural Specialty Pages (Lazy Loaded)
const SeasonalPage = lazy(() => import('./pages/public/SeasonalPage').then(m => ({ default: m.SeasonalPage })));
const FreshHarvestPage = lazy(() => import('./pages/public/FreshHarvestPage').then(m => ({ default: m.FreshHarvestPage })));
const FarmerNetworkPage = lazy(() => import('./pages/public/FarmerNetworkPage').then(m => ({ default: m.FarmerNetworkPage })));
const QuotationRequestPage = lazy(() => import('./pages/public/QuotationRequestPage').then(m => ({ default: m.QuotationRequestPage })));
const DeliveryInfoPage = lazy(() => import('./pages/public/DeliveryInfoPage').then(m => ({ default: m.DeliveryInfoPage })));
const HowItWorksPage = lazy(() => import('./pages/public/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));

// Customer & B2B Pages (Lazy Loaded)
const LoginPage = lazy(() => import('./pages/customer/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/customer/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AccountDashboardPage = lazy(() => import('./pages/customer/AccountDashboardPage').then(m => ({ default: m.AccountDashboardPage })));
const WishlistPage = lazy(() => import('./pages/customer/WishlistPage').then(m => ({ default: m.WishlistPage })));
const WholesalePortalPage = lazy(() => import('./pages/wholesale/WholesalePortalPage').then(m => ({ default: m.WholesalePortalPage })));
const WholesaleDashboardPage = lazy(() => import('./pages/wholesale/WholesaleDashboardPage').then(m => ({ default: m.WholesaleDashboardPage })));

// Admin Pages (Lazy Loaded)
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage').then(m => ({ default: m.AdminOverviewPage })));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminInventoryPage = lazy(() => import('./pages/admin/AdminInventoryPage').then(m => ({ default: m.AdminInventoryPage })));
const AdminPurchasesPage = lazy(() => import('./pages/admin/AdminPurchasesPage').then(m => ({ default: m.AdminPurchasesPage })));
const AdminSuppliersPage = lazy(() => import('./pages/admin/AdminSuppliersPage').then(m => ({ default: m.AdminSuppliersPage })));
const AdminFarmersPage = lazy(() => import('./pages/admin/AdminFarmersPage').then(m => ({ default: m.AdminFarmersPage })));
const AdminQualityPage = lazy(() => import('./pages/admin/AdminQualityPage').then(m => ({ default: m.AdminQualityPage })));
const AdminWholesalePage = lazy(() => import('./pages/admin/AdminWholesalePage').then(m => ({ default: m.AdminWholesalePage })));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage').then(m => ({ default: m.AdminCouponsPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));
const AdminAuditLogsPage = lazy(() => import('./pages/admin/AdminAuditLogsPage').then(m => ({ default: m.AdminAuditLogsPage })));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <CartProvider>
                <WishlistProvider>
                  <Suspense fallback={<PageLoader />}>
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
                  </Suspense>
                </WishlistProvider>
              </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
