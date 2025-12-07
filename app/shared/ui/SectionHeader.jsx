export default function SectionHeader({title, subtitle, className}) {
  return (
    <div className={`mt-20 md:mt-25 mb-10 ${className || ""}`}>
      <h2 className="relative text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">
         {(() => {
      const words = title.split(" ");
      const lastWord = words.pop(); 
      return (
        <>
          {words.join(" ")}{" "}
          <span className="text-primary">{lastWord}</span>
        </>
      );
    })()}
        <div className="min-w-20 w-1/12 h-1 rounded-full -bottom-3 bg-primary absolute left-0 right-0 mx-auto"></div>
      </h2>
      <p className="mt-6 text-neutral text-center">{subtitle}</p>
    </div>
  );
}
