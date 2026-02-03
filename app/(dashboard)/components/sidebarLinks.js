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
import {GoMegaphone, GoPackage} from "react-icons/go";
import {FaGear} from "react-icons/fa6";
/* ================= USER ================= */
export const userSidebarLinks = [
  {id: 1, label: "Dashboard", icon: <FiHome />, path: "/dashboard/user"},
  {id: 2, label: "Profile", icon: <FiUser />, path: "/dashboard/user/profile"},
  {
    id: 3,
    label: "My Bookings",
    icon: <FiCalendar />,
    path: "/dashboard/user/my-bookings",
  },
  {
    id: 4,
    label: "Messages",
    icon: <FaInbox />,
    path: "/dashboard/user/messages",
  },
  {
    id: 5,
    label: "Purchases",
    icon: <FiCreditCard />,
    path: "/dashboard/user/purchases",
  },
  {
    id: 6,
    label: "Announcements",
    icon: <GoMegaphone />,
    path: "/dashboard/user/announcements",
  },
  {
    id: 7,
    label: "Leave Feedback ",
    icon: <FiMessageSquare />,
    path: "/dashboard/user/feedback",
  },
];

/* ================= ADMIN ================= */
export const adminSidebarLinks = [
  {id: 1, label: "Dashboard", icon: <FiHome />, path: "/dashboard/admin"},
  {id: 2, label: "Profile", icon: <FiUser />, path: "/dashboard/admin/profile"},
  {
    id: 3,
    label: "Manage Packages",
    icon: <GoPackage />,
    path: "/dashboard/admin/manage-packages",
  },
  {
    id: 4,
    label: "Manage Instructors",
    icon: <FiUsers />,
    path: "/dashboard/admin/manage-instructors",
  },
  {
    id: 5,
    label: "Manage Users",
    icon: <FiShield />,
    path: "/dashboard/admin/manage-users",
  },
  {
    id: 6,
    label: "Manage Suburbs",
    icon: <FiMapPin />,
    path: "/dashboard/admin/manage-suburbs",
  },
  {
    id: 7,
    label: "Add Announcements",
    icon: <GoMegaphone />,
    path: "/dashboard/admin/add-announcements",
  },
  {
    id: 8,
    label: "Coupon & Vouchers",
    icon: <FiGift />,
    path: "/dashboard/admin/add-coupon-vouchers",
  },
];

/* ================= INSTRUCTOR ================= */
export const instructorSidebarLinks = [
  {
    id: 1,
    label: "Dashboard",
    icon: <FiHome />,
    path: "/dashboard/instructor",
  },
  {
    id: 2,
    label: "Profile",
    icon: <FiUser />,
    path: "/dashboard/instructor/profile",
  },
  {
    id: 3,
    label: "Bookings",
    icon: <FiCalendar />,
    path: "/dashboard/instructor/bookings",
  },
  {
    id: 4,
    label: "Messages",
    icon: <FiMessageSquare />,
    path: "/dashboard/instructor/messages",
  },
  {
    id: 5,
    label: "Suburbs",
    icon: <FiMapPin />,
    path: "/dashboard/instructor/suburbs",
  },
  {
    id: 6,
    label: "Manage Service Package",
    icon: <GoPackage />,
    path: "/dashboard/instructor/instructor-service-pacakge",
  },
  {
    id: 7,
    label: "Financial",
    icon: <FiDollarSign />,
    path: "/dashboard/instructor/financial",
  },
  {
    id: 8,
    label: "Announcements",
    icon: <GoMegaphone />,
    path: "/dashboard/instructor/announcements",
  },
  {
    id: 9,
    label: "Settings",
    icon: <FaGear />,
    path: "/dashboard/instructor/settings",
  },
];
