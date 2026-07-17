"use client";

import {ToastContainer} from "react-toastify";
import Sidebar from "./components/Sidebar";
import Navbar from "../shared/ui/Navbar";
import TopHeader from "../shared/ui/TopHeader";
import ProtectedRoute from "../utils/ProtectedRoute";
import InstructorOverdueModalGate from "../shared/ui/InstructorOverdueModalGate";

export default function DashboardLayout({children}) {
  return (
    <ProtectedRoute>
      <ToastContainer style={{ zIndex: 999999 }} />
      <TopHeader />
      <Navbar />
  <InstructorOverdueModalGate />
   
      <div className="flex flex-col lg:flex-row">
  <Sidebar />

  <main
    className="
      flex-1 min-w-0
      p-2 py-6 md:p-6
      min-h-[calc(100vh-4rem)]
      transition-all duration-300
    "
  >
    {children}
  </main>
</div>
    </ProtectedRoute>
  );
}
