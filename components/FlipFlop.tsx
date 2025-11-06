import React from 'react';

interface FlipFlopProps {
  id: string;
  label: string;
  j: boolean;
  k: boolean;
  q: boolean;
  isLabMode: boolean;
  isHighlighted: boolean;
  clockSource: string;
}

const FlipFlop: React.FC<FlipFlopProps> = ({ id, label, j, k, q, isLabMode, isHighlighted, clockSource }) => {
  const qVal = q ? 1 : 0;
  const qBarVal = q ? 0 : 1;
  const jVal = j ? 1 : 0;
  const kVal = k ? 1 : 0;

  const qColor = q ? 'text-green-400' : 'text-red-500';
  const qBarColor = !q ? 'text-green-400' : 'text-red-500';
  const highlightClass = isHighlighted ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-cyan-700';

  return (
    <div className="flex flex-col items-center font-mono z-10">
      <span className="font-bold text-base mb-1">{`FF_${label}`}</span>
      <div className={`relative bg-gray-900 border-2 ${highlightClass} rounded-lg w-32 h-44 flex flex-col justify-between p-1 transition-all duration-300`}>
        {/* Top section for J input and Q output */}
        <div className="flex justify-between items-start px-1 pt-1">
          <div className="flex items-center">
            <span className="text-sm font-bold w-4 text-center">J</span>
            <div className="w-2 h-px bg-gray-500"></div>
            <span className={`text-sm ml-1 ${isLabMode ? 'text-cyan-400' : 'text-gray-500'}`}>{jVal}</span>
          </div>
          <div className="flex items-center">
            <span className={`font-bold text-lg ${qColor}`}>{qVal}</span>
            <div className="w-2 h-px bg-gray-500"></div>
            <span className="text-sm font-bold w-4 text-center">Q</span>
          </div>
        </div>

        {/* Center content: Large Q state */}
        <div className="flex-grow flex items-center justify-center">
          <span className={`text-6xl font-bold ${qColor}`}>{qVal}</span>
        </div>

        {/* Bottom section for K input and Q-bar output */}
        <div className="flex justify-between items-end px-1 pb-1">
          <div className="flex items-center">
            <span className="text-sm font-bold w-4 text-center">K</span>
            <div className="w-2 h-px bg-gray-500"></div>
            <span className={`text-sm ml-1 ${isLabMode ? 'text-cyan-400' : 'text-gray-500'}`}>{kVal}</span>
          </div>
          <div className="flex items-center">
            <span className={`font-bold text-lg ${qBarColor}`}>{qBarVal}</span>
            <div className="w-2 h-px bg-gray-500"></div>
            <span className="text-sm font-bold w-5 text-center">Q̅</span>
          </div>
        </div>
        
        {/* CLK input at the bottom center */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center">
             <div className="w-2 h-2 rounded-full border-2 border-gray-400 bg-gray-900 -mb-1"></div>
             <div className="border-l-4 border-r-4 border-b-6 border-transparent border-transparent border-b-gray-400 -mb-1"></div>
             <div className="w-px h-2 bg-gray-400"></div>
             <span className="text-gray-400 text-xs mt-1">{clockSource}</span>
        </div>

      </div>
    </div>
  );
};

export default FlipFlop;
