import React from 'react';

interface FlipFlopProps {
  id: string;
  label: string;
  j: boolean;
  k: boolean;
  q: boolean;
  isLabMode: boolean;
  isHighlighted: boolean;
}

const FlipFlop: React.FC<FlipFlopProps> = ({ id, label, j, k, q, isLabMode, isHighlighted }) => {
  const qVal = q ? 1 : 0;
  const qBarVal = q ? 0 : 1;
  const jVal = j ? 1 : 0;
  const kVal = k ? 1 : 0;
  const highlightClass = isHighlighted ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-cyan-700';

  return (
    <div className={`relative bg-gray-900 border-2 ${highlightClass} rounded-md w-full h-full transition-all duration-300 flex items-center justify-center font-mono`}>
      {/* Input Labels */}
      <div className="absolute -left-4 top-0 h-full flex flex-col justify-between py-2 text-sm text-gray-400">
        <span className="h-1/3 flex items-center">J</span>
        <span className="h-1/3 flex items-center">K</span>
      </div>
      
      {/* CLK Input with correct symbol */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full flex items-center text-sm text-gray-400">
        <svg width="14" height="14" viewBox="0 0 16 16" className="inline-block -mr-1">
          <circle cx="4.5" cy="8" r="2.5" fill="#1f2937" stroke="currentColor" strokeWidth="1.2" />
          <path d="M 7 5 L 12 8 L 7 11 Z" fill="currentColor" />
        </svg>
        <span className="ml-1 font-sans">CLK</span>
      </div>

      {/* Input value indicators */}
      <span className={`absolute -left-8 top-1/4 -translate-y-1/2 text-sm ${isLabMode ? 'text-cyan-400' : 'text-gray-500'}`}>{jVal}</span>
      <span className={`absolute -left-8 top-3/4 -translate-y-1/2 text-sm ${isLabMode ? 'text-cyan-400' : 'text-gray-500'}`}>{kVal}</span>

      {/* Output Labels */}
      <div className="absolute -right-6 top-0 h-full flex flex-col justify-around py-3 text-sm text-gray-400">
        <span>Q</span>
        <span>Q̅</span>
      </div>

      {/* Output value indicators */}
      <span className={`absolute -right-9 top-1/4 -translate-y-1/2 text-lg font-bold ${q ? 'text-green-400' : 'text-red-500'}`}>{qVal}</span>
      <span className={`absolute -right-9 top-3/4 -translate-y-1/2 text-lg font-bold ${!q ? 'text-green-400' : 'text-red-500'}`}>{qBarVal}</span>

      {/* Async Inputs (PR, CL) */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-400">PR</div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-400">CL</div>
      
      {/* Main Body */}
      <div className="text-center">
        <span className="text-lg font-bold">{`FF_${label}`}</span>
        <span className={`block text-5xl font-bold opacity-20 ${q ? 'text-green-400' : 'text-red-500'}`}>{qVal}</span>
      </div>
    </div>
  );
};

export default FlipFlop;