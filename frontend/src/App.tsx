
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MockAuthProvider from "./contexts/MockAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FeaturePlaceholder from "./pages/FeaturePlaceholder";
import NotFound from "./pages/NotFound";
import AttendanceManage from "./pages/AttendanceManage";
import AttendanceScan from "./pages/AttendanceScan";
import AttendanceHistory from "./pages/AttendanceHistory";
import DonationPage from "./pages/DonationPage";
import GalleryPage from "./pages/GalleryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <MockAuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Feature routes */}
          <Route path="/attendance/scan" element={
            <ProtectedRoute>
              <AttendanceScan />
            </ProtectedRoute>
          } />
          <Route path="/attendance/history" element={
            <ProtectedRoute>
              <AttendanceHistory />
            </ProtectedRoute>
          } />
          <Route path="/attendance/manage" element={
            <ProtectedRoute>
              <AttendanceManage />
            </ProtectedRoute>
          } />
          <Route path="/gallery" element={
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          } />
          <Route path="/gallery/upload" element={
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          } />
          <Route path="/donation" element={
            <ProtectedRoute>
              <DonationPage />
            </ProtectedRoute>
          } />
          <Route path="/donation/manage" element={
            <ProtectedRoute>
              <FeaturePlaceholder />
            </ProtectedRoute>
          } />
          <Route path="/events/manage" element={
            <ProtectedRoute>
              <FeaturePlaceholder />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </MockAuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
