import React from 'react';
import FlipFlop from './FlipFlop';
import { CounterMode } from '../types';

interface CounterDisplayProps {
  qStates: boolean[];
  jStates: boolean[];
  kStates: boolean[];
  counterMode: CounterMode;
  modeM: boolean;
  isLabMode: boolean;
  highlightedFF: number[];
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({
  qStates, jStates, kStates, counterMode, modeM, isLabMode, highlightedFF
}) => {
  const labels = ['D', 'C', 'B', 'A'];
  const ffPositions = [{x: 14, y: 50}, {x: 38, y: 50}, {x: 62, y: 50}, {x: 86, y: 50}];

  const getClockSourceText = (index: number): string => {
    if (index === 3) return "CLK";
    const prevLabel = labels[index + 1];
    switch(counterMode) {
      case CounterMode.MOD16_UP:
      case CounterMode.MOD10_UP:
        return `Q_${prevLabel}`;
      case CounterMode.MOD16_DOWN:
        return `Q̅_${prevLabel}`;
      case CounterMode.MOD16_UP_DOWN:
        return modeM ? `Q̅_${prevLabel}` : `Q_${prevLabel}`;
      default:
        return "";
    }
  };

  const getWirePath = (index: number) => {
    if (index === 3) return null; // No incoming ripple for FF_A
    
    const from = ffPositions[index+1];
    const to = ffPositions[index];
    const useQBar = (counterMode === CounterMode.MOD16_DOWN) || (counterMode === CounterMode.MOD16_UP_DOWN && modeM);
    
    const startY = useQBar ? from.y + 19 : from.y - 19;
    const midX = from.x + (to.x - from.x) / 2;

    return `M ${from.x + 5},${startY} H ${midX} V ${to.y + 24} H ${to.x}`;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative min-h-[350px]">
      <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">Diagrama de Flip-Flops</h2>
      
      {/* Wires Layer */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Main CLK line to FF_A */}
        <path d={`M ${ffPositions[3].x},98 V ${ffPositions[3].y + 24}`} stroke="#FBBF24" strokeWidth="0.5" fill="none" />
        
        {/* Ripple connections */}
        {labels.slice(0, 3).map((_, i) => (
           <path key={`wire-${i}`} d={getWirePath(i) || ''} stroke="#9CA3AF" strokeWidth="0.5" fill="none" />
        ))}

        {/* MOD-10 Reset Logic */}
        {counterMode === CounterMode.MOD10_UP && (
          <>
            <path d={`M ${ffPositions[0].x+5},${ffPositions[0].y-19} H ${ffPositions[0].x+8} V 8 H 44`} stroke="#F472B6" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
            <path d={`M ${ffPositions[2].x+5},${ffPositions[2].y-19} H ${ffPositions[2].x+8} V 14 H 44`} stroke="#34D399" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />

            {/* AND Gate */}
            <path d="M 44,6 h 4 v 10 h -4 a 5,5 0 0 1 0,-10 z" stroke="#EAB308" strokeWidth="0.5" fill="none" />
            <text x="46" y="12" fill="#EAB308" fontSize="3" textAnchor="middle">&amp;</text>
            <path d="M 50,11 H 54" stroke="#EAB308" strokeWidth="0.5" fill="none"/>
            <text x="56" y="12" fill="#EAB308" fontSize="3" textAnchor="start">CLR</text>
            
            <text x="35" y="8" fill="#F472B6" fontSize="2.5" textAnchor="end">Q_D</text>
            <text x="35" y="14" fill="#34D399" fontSize="2.5" textAnchor="end">Q_B</text>
          </>
        )}
      </svg>
      
      {/* FlipFlops Layer */}
      <div className="relative flex justify-around items-center mt-16">
        {labels.map((label, i) => (
          <FlipFlop
            key={label}
            id={`FF_${label}`}
            label={label}
            j={jStates[i]}
            k={kStates[i]}
            q={qStates[i]}
            isLabMode={isLabMode && i === 3}
            isHighlighted={highlightedFF.includes(3 - i)}
            clockSource={getClockSourceText(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default CounterDisplay;
