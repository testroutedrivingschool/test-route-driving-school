"use client";

export default function Loading() {
  return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-32 h-6">
        {/* Ball 1 */}
        <div className="absolute w-6 h-6 bg-primary rounded-full animate-bounce-left"></div>
        {/* Ball 2 */}
        <div className="absolute w-6 h-6 bg-secondary rounded-full animate-bounce-right"></div>
      </div>

      <style jsx>{`
        @keyframes bounceLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(100px); }
        }
        @keyframes bounceRight {
          0%, 100% { transform: translateX(100px); }
          50% { transform: translateX(0); }
        }

        .animate-bounce-left {
          animation: bounceLeft 1s ease-in-out infinite;
        }
        .animate-bounce-right {
          animation: bounceRight 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
