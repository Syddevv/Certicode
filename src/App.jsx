import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthCallback from "./components/AuthCallback";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CreateNewPassword from "./pages/auth/CreateNewPassword";

// Public
import LandingPage from "./pages/public/LandingPage";
import TermsAndConditions from "./pages/public/TermsAndConditions";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import Marketplace from "./pages/public/Marketplace";
import ProductDetails from "./pages/public/ProductDetails";
import Cart from "./pages/public/Cart";
import PromoCodes from "./pages/public/PromoCodes";
import Checkout from "./pages/public/Checkout";
import OrderSuccess from "./pages/public/OrderSuccess";
import BuyerDashboard from "./pages/public/BuyerDashboard";
import MyPurchases from "./pages/public/MyPurchases";
import BillingInvoices from "./pages/public/BillingInvoices";
import InvoiceDetails from "./pages/public/InvoiceDetails";
import BuyerAccountSettings from "./pages/public/BuyerAccountSettings";
import About from "./pages/public/About";
import PurchasedAssetDetail from "./pages/public/PurchasedAssetDetail";
import CustomerSupport from "./pages/public/CustomerSupport";
import ContactUs from "./pages/public/ContactUs";
import SuccessStories from "./pages/public/SuccessStories";
import SuccessStoryIronclad from "./pages/public/SuccessStoryIronclad";
import BlogsNews from "./pages/public/BlogsNews";
import BlogsNewsIndividual from "./pages/public/BlogsNewsIndividual";
import NotFound from "./pages/public/NotFound";

// Admin
import AdminInventory from "./pages/admin/AdminInventory";
import AdminSales from "./pages/admin/AdminSales";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCustomerDetails from "./pages/admin/AdminCustomerDetails"; // <--- IMPORT ADDED HERE
import AdminSetting from "./pages/admin/AdminSetting";
import PlatformSetting from "./pages/admin/PlatformSetting";
import SupportDesk from "./pages/admin/SupportDesk";
import TicketDetail from "./pages/admin/TicketDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNotification from "./pages/admin/AdminNotification";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";

import AdminAddNewAsset from "./pages/admin/AdminAddNewAsset";

import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import ResetPasswordRoute from "./pages/public/ResetPasswordRoute";
import VerifyMobileNumberRoute from "./pages/public/VerifyMobileNumberRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      {/* Create a wrapper component that uses useAuth */}
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<CreateNewPassword />} />
      {/* ADMIN ROUTES - Protected and Admin only */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminSales />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminCustomers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-notification"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminNotification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminSetting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/platform-settings"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <PlatformSetting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <SupportDesk />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ticket/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <TicketDetail />
          </ProtectedRoute>
        }
      />
      {/* PUBLIC PAGES / USER */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/promo-codes" element={<PromoCodes />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/about" element={<About />} />
      <Route path="/marketplace/:id" element={<ProductDetails />} />
      <Route path="/customer-support" element={<CustomerSupport />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/success-stories" element={<SuccessStories />} />
      <Route
        path="/success-stories/scaling-with-the-ironclad-ui-kit"
        element={<SuccessStoryIronclad />}
      />
      <Route path="/blogs-news" element={<BlogsNews />} />

      <Route
        path="/customer-support/account-recovery/reset-password"
        element={<ResetPasswordRoute />}
      />
      <Route
        path="/customer-support/account-recovery/verify-mobile-number"
        element={<VerifyMobileNumberRoute />}
      />
      <Route
        path="/blogs-news/how-secure-software"
        element={<BlogsNewsIndividual />}
      />
      {/* PROTECTED USER ROUTES - Require authentication */}
      <Route
        path="/buyer-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-purchases"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <MyPurchases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-purchases/:assetSlug"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <PurchasedAssetDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing-invoices"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <BillingInvoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing-invoices/:invoiceId"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <InvoiceDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account-settings"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <BuyerAccountSettings />
          </ProtectedRoute>
        }
      />
      <Route path="/add-asset" element={<AdminAddNewAsset />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
