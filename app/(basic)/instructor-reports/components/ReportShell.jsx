"use client";

export default function ReportShell({
  title,
  children,
  onRun,
  isRunning = false,
  hideMobileTopButton = false,
}) {
  return (
    <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 border-b border-border-color bg-[#f5f6f8]">
        <div className="flex items-center gap-3">
          <div className="text-primary text-lg">📈</div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className={`bg-primary text-white font-semibold px-2 md:px-4 py-2 md:py-3 rounded-md   disabled:opacity-60 ${
            hideMobileTopButton ? "hidden lg:inline-flex" : "inline-flex"
          }`}
        >
          {isRunning ? "Running..." : "Run Report"}
        </button>
      </div>

      <div className="px-2 py-4 md:px-4">{children}</div>
    </div>
  );
}