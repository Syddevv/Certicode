import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Public
import LandingPage from "./pages/public/LandingPage";
<<<<<<< HEAD
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
=======

// Admin
>>>>>>> db7d3bb34b4cb1823efffe107e742d662a4eae0f
import AdminInventory from "./pages/admin/AdminInventory";
import AdminSales from "./pages/admin/AdminSales";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminSetting from "./pages/admin/AdminSetting";
import PlatformSetting from "./pages/admin/PlatformSetting";
import SupportDesk from "./pages/admin/SupportDesk"; 
import TicketDetail from "./pages/admin/TicketDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

<<<<<<< HEAD
        {/* ADMIN */}
=======
        {/* Admin Core */}
>>>>>>> db7d3bb34b4cb1823efffe107e742d662a4eae0f
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/inventory" element={<AdminInventory />} />
        <Route path="/sales" element={<AdminSales />} />
        <Route path="/customers" element={<AdminCustomers />} />

<<<<<<< HEAD
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
        <Route path="/billing-invoices" element={<BillingInvoices />} />
        <Route
          path="/marketplace/e-commerce-saas-template"
          element={<ProductDetails />}
        />
=======
        {/* Settings - Both point to /settings in Sidebar, but have unique paths */}
        <Route path="/settings" element={<AdminSetting />} />
        <Route path="/platform-settings" element={<PlatformSetting />} />
        
        {/* Support Routes */}
        <Route path="/support" element={<SupportDesk />} />
        <Route path="/ticket" element={<TicketDetail />} />

        {/* Redirect if no path matches */}
        <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> db7d3bb34b4cb1823efffe107e742d662a4eae0f
      </Routes>
    </BrowserRouter>
  );
}

export default App;