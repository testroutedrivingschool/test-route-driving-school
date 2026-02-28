"use client"
export default function LoadingSpinner({className}) {
  return (
     <div className={`w-full flex items-center justify-center min-h-[80vh]  ${className}`}>
      <div className="flex space-x-2">
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
}