
export default function Container({children,className}) {
  return <div className={`max-w-[1320px] mx-auto px-3 md:px-4 ${className}`}>{children}</div>;
}
