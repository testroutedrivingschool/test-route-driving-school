import SalesTabs from "../components/SalesTabs";


export default function SalesLayout({ children }) {
  return (
  <div className="relative">

      {/* Fixed Tabs */}
      <SalesTabs />

      {/* Page content */}
      <div className="">
        {children}
      </div>
    </div>
  );
}
