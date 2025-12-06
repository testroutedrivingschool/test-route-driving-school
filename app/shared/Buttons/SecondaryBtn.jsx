

export default function SecondaryBtn({children, type, onClick}) {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      className="bg-secondary transition font-bold text-white border border-transparent hover:bg-transparent hover:border-base-300 hover:text-primary rounded-md px-4 py-2 flex items-center gap-2"
    >
      {children}
    </button>
  );
}
