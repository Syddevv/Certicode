import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Public
import LandingPage from "./pages/public/LandingPage";

// Admin
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

        {/* Admin Core */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/inventory" element={<AdminInventory />} />
        <Route path="/sales" element={<AdminSales />} />
        <Route path="/customers" element={<AdminCustomers />} />

        {/* Settings - Both point to /settings in Sidebar, but have unique paths */}
        <Route path="/settings" element={<AdminSetting />} />
        <Route path="/platform-settings" element={<PlatformSetting />} />
        
        {/* Support Routes */}
        <Route path="/support" element={<SupportDesk />} />
        <Route path="/ticket" element={<TicketDetail />} />

        {/* Redirect if no path matches */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;