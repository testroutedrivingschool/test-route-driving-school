import {FaInbox} from "react-icons/fa";
import {
  FiHome,
  FiUser,
  FiCalendar,
  FiUsers,
  FiShield,
  FiMessageSquare,
  FiMapPin,
  FiDollarSign,
  FiFileText,
  FiCreditCard,
  FiGift,
} from "react-icons/fi";
import { GoMegaphone, GoPackage } from "react-icons/go";
import { FaGear } from "react-icons/fa6";
/* ================= USER ================= */
export const userSidebarLinks = [
  {id: 1, label: "Dashboard", icon: <FiHome />, path: "/dashboard"},
  {id: 2, label: "Profile", icon: <FiUser />, path: "/dashboard/user-profile"},
  {
    id: 3,
    label: "My Bookings",
    icon: <FiCalendar />,
    path: "/dashboard/my-bookings",
  },
  {
    id: 4,
    label: "Messages",
    icon: <FaInbox />,
    path: "/dashboard/messages",
  },
  {
    id: 5,
    label: "Purchases",
    icon: <FiCreditCard />,
    path: "/dashboard/purchases",
  },
  {
    id: 6,
    label: "Leave Feedback ",
    icon: <FiMessageSquare />,
    path: "/dashboard/feedback",
  },
];

/* ================= ADMIN ================= */
export const adminSidebarLinks = [
  {id: 1, label: "Dashboard", icon: <FiHome />, path: "/dashboard"},
  {id: 2, label: "Profile", icon: <FiUser />, path: "/dashboard/admin-profile"},
  {
    id: 3,
    label: "Manage Packages",
    icon: <GoPackage  />,
    path: "/dashboard/manage-packages",
  },
  {
    id: 4,
    label: "Manage Instructors",
    icon: <FiUsers />,
    path: "/dashboard/manage-instructors",
  },
  {
    id: 5,
    label: "Manage Users",
    icon: <FiShield />,
    path: "/dashboard/manage-users",
  },
  {
    id: 6,
    label: "Announcements",
    icon: <GoMegaphone />,
    path: "/dashboard/announcements",
  },
  {
    id: 7,
    label: "Coupon & Vouchers",
    icon: <FiGift />,
    path: "/dashboard/coupon-vouchers",
  },
];

/* ================= INSTRUCTOR ================= */
export const instructorSidebarLinks = [
  {id: 1, label: "Dashboard", icon: <FiHome />, path: "/dashboard"},
  {
    id: 2,
    label: "Profile",
    icon: <FiUser />,
    path: "/dashboard/instructor-profile",
  },
  {
    id: 3,
    label: "Bookings",
    icon: <FiCalendar />,
    path: "/dashboard/my-bookings",
  },
  {
    id: 4,
    label: "Messages",
    icon: <FiMessageSquare />,
    path: "/dashboard/messages",
  },
  {
    id: 5,
    label: "Suburbs",
    icon: <FiMapPin />,
    path: "/dashboard/suburbs",
  },
  {
    id: 6,
    label: "Financial",
    icon: <FiDollarSign />,
    path: "/dashboard/financial",
  },
  {
    id:7,
    label:"Setting",
    icon:<FaGear/> ,
      path: "/dashboard/instructor-setting",
  }
];
