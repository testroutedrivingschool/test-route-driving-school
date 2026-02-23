
import "../globals.css";
import {ToastContainer} from "react-toastify";
import TopHeader from "../shared/ui/TopHeader";
import Header from "../shared/ui/Header";
import ScrollToTopButton from "../shared/ui/ScrollToTop";
import Footer from "../shared/ui/Footer";

export const metadata = {
  title: "Test Route Driving School",
  description: "Learn to drive with confidence! Certified instructors and modern vehicles ensure a safe and effective learning experience.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function BasicLayout({children}) {
  return (
    <div>
     
          <ToastContainer style={{ zIndex: 999999 }} />
          <TopHeader />
          <Header />
          <main className="min-h-[90vh]">{children}</main>
        
          <ScrollToTopButton />

          <Footer />
       
    </div>
  );
}
