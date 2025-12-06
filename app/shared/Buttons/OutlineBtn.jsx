export default function OutlineBtn({children, type, onClick}) {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      className="bg-transparent text-primary transition font-bold  border border-primary hover:bg-primary hover:border-base-300 hover:text-white rounded-md px-4 py-2"
    >
      {children}
    </button>
  );
}
