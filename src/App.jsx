import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CreateNewPassword from "./pages/auth/CreateNewPassword";

// Public
import LandingPage from "./pages/public/LandingPage"; // Note: unused in routes below, but kept from your original code
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

import AdminAddNewAsset from "./pages/admin/AdminAddNewAsset";

import AdminOrderDetails from "./pages/admin/AdminOrderDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        {/* ADMIN */}

        {/* Admin Core */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/inventory" element={<AdminInventory />} />
        <Route path="/sales" element={<AdminSales />} />

        {/* Customer Routes */}
        <Route path="/customers" element={<AdminCustomers />} />
        <Route path="/customers/details" element={<AdminCustomerDetails />} />

        {/* <--- ROUTE ADDED HERE */}
        <Route path="/sales/order-details" element={<AdminOrderDetails />} />
        <Route path="/admin-notification" element={<AdminNotification />} />

        {/* PUBLIC PAGES / USER */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/promo-codes" element={<PromoCodes />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route
          path="/my-purchases/e-commerce-saas-template"
          element={<PurchasedAssetDetail />}
        />
        <Route path="/billing-invoices" element={<BillingInvoices />} />
        <Route path="/billing-invoices/inv-8273" element={<InvoiceDetails />} />
        <Route path="/account-settings" element={<BuyerAccountSettings />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/blogs-news" element={<BlogsNews />} />
        <Route
          path="/blogs-news/how-secure-software"
          element={<BlogsNewsIndividual />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/marketplace/e-commerce-saas-template"
          element={<ProductDetails />}
        />

        {/* Settings - Both point to /settings in Sidebar, but have unique paths */}
        <Route path="/settings" element={<AdminSetting />} />

        <Route path="/platform-settings" element={<PlatformSetting />} />
        {/* Support Routes */}

        <Route path="/support" element={<SupportDesk />} />

        <Route path="/ticket" element={<TicketDetail />} />
        {/* Add New Asset */}

        <Route path="/add-asset" element={<AdminAddNewAsset />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
