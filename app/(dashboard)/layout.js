"use client";

import {ToastContainer} from "react-toastify";
import Sidebar from "./components/Sidebar";
import Navbar from "../shared/ui/Navbar";
import TopHeader from "../shared/ui/TopHeader";
import ProtectedRoute from "../utils/ProtectedRoute";

export default function DashboardLayout({children}) {
  return (
    <ProtectedRoute>
      <ToastContainer />
      <TopHeader />
      <Navbar />

      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main
          className={`
              flex-1 p-4 md:p-6 py-6 min-w-0 min-h-[calc(100vh-4rem)]
              transition-all duration-300
            `}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
