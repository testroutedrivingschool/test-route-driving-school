"use client"
export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex space-x-2">
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}