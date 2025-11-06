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
  const ffLabels = ['D', 'C', 'B', 'A']; // MSB to LSB
  // Posiciones y dimensiones en porcentajes para un layout responsive
  // [FF_D, FF_C, FF_B, FF_A]
  const ffLayout = [
    { left: 5, top: 45, width: 15, height: 25 },
    { left: 28, top: 45, width: 15, height: 25 },
    { left: 51, top: 45, width: 15, height: 25 },
    { left: 74, top: 45, width: 15, height: 25 },
  ];

  const getPortCoords = (ffIndex: number, port: 'CLK' | 'Q' | 'Q_BAR' | 'CL') => {
      const ff = ffLayout[ffIndex];
      switch(port) {
          case 'CLK': return { x: ff.left, y: ff.top + ff.height / 2 };
          case 'Q': return { x: ff.left + ff.width, y: ff.top + ff.height * 0.3 };
          case 'Q_BAR': return { x: ff.left + ff.width, y: ff.top + ff.height * 0.7 };
          case 'CL': return { x: ff.left + ff.width / 2, y: ff.top + ff.height };
          default: return {x:0, y:0};
      }
  }

  const getRippleWirePath = (ffIndex: number) => {
    if (ffIndex === 3) return null; // FF_A es síncrono al reloj principal
    
    const to = getPortCoords(ffIndex, 'CLK');
    const useQBar = (counterMode === CounterMode.MOD16_DOWN) || (counterMode === CounterMode.MOD16_UP_DOWN && modeM);
    const from = getPortCoords(ffIndex + 1, useQBar ? 'Q_BAR' : 'Q');
    const midX = from.x + 4; // Extend horizontally before turning

    // Clean elbow connection
    return `M ${from.x},${from.y} H ${midX} V ${to.y} H ${to.x}`;
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg relative min-h-[400px]">
      <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">Diagrama de Flip-Flops</h2>
      
      <div className="relative w-full h-80">
        {/* SVG Layer for wires and labels */}
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          
          {/* Main CLK line to FF_A */}
          <path d={`M ${getPortCoords(3, 'CLK').x - 10},${getPortCoords(3, 'CLK').y} H ${getPortCoords(3, 'CLK').x}`} stroke="#FBBF24" strokeWidth="0.5" fill="none" />
          <path d={`M ${getPortCoords(3, 'CLK').x-10},${getPortCoords(3, 'CLK').y+2} L ${getPortCoords(3, 'CLK').x-10},${getPortCoords(3, 'CLK').y-2} L ${getPortCoords(3, 'CLK').x-12},${getPortCoords(3, 'CLK').y-2} L ${getPortCoords(3, 'CLK').x-12},${getPortCoords(3, 'CLK').y+2} Z`} stroke="#FBBF24" strokeWidth="0.5" fill="none"/>
          
          {/* Ripple connections */}
          {ffLabels.slice(0, 3).map((_, i) => (
             <path key={`wire-${i}`} d={getRippleWirePath(i) || ''} stroke="#9CA3AF" strokeWidth="0.5" fill="none" />
          ))}

          {/* Output Taps & Labels (Q_A, Q_B, ...) */}
          {ffLabels.map((label, i) => {
            const q_out = getPortCoords(i, 'Q');
            const q_state = qStates[i];
            const outputLabel = `Q_${label}`;
            return (
              <g key={`q-out-${label}`}>
                <path d={`M ${q_out.x},${q_out.y} V ${q_out.y - 15} H ${q_out.x - 4}`} stroke="#9CA3AF" strokeWidth="0.5" fill="none" />
                <circle cx={q_out.x - 4} cy={q_out.y - 15} r="2" fill={q_state ? '#4ADE80' : '#374151'} stroke="#9CA3AF" strokeWidth="0.5" />
                <text x={q_out.x - 4} y={q_out.y - 20} fill="#E5E7EB" fontSize="3.5" textAnchor="middle" fontWeight="bold">{outputLabel}</text>
              </g>
            )
          })}

          {/* MOD-10 Reset Logic */}
          {counterMode === CounterMode.MOD10_UP && (
            <>
              {/* AND Gate */}
              <path d="M 43,15 h 4 v 10 h -4 a 5,5 0 0 1 0,-10 z" stroke="#EAB308" strokeWidth="0.5" fill="none" />
              <text x="45" y="21" fill="#EAB308" fontSize="3" textAnchor="middle">&amp;</text>
              
              {/* Wires to AND gate from Q_D and Q_B */}
              <path d={`M ${getPortCoords(0, 'Q').x}, ${getPortCoords(0, 'Q').y} H ${getPortCoords(0, 'Q').x + 2} V 17.5 H 43`} stroke="#9CA3AF" strokeWidth="0.5" fill="none" />
              <path d={`M ${getPortCoords(2, 'Q').x}, ${getPortCoords(2, 'Q').y} H ${getPortCoords(2, 'Q').x + 2} V 22.5 H 43`} stroke="#9CA3AF" strokeWidth="0.5" fill="none" />
              
              {/* CLR Bus from AND gate */}
              <path d="M 49,20 H 81.5" stroke="#EAB308" strokeWidth="0.5" fill="none"/>
              <text x="50" y="19" fill="#EAB308" fontSize="3" textAnchor="start">CLR</text>

              {/* Wires from Bus to CL inputs */}
              {ffLabels.map((_, i) => (
                 <path key={`clr-wire-${i}`} d={`M ${getPortCoords(i,'CL').x},${getPortCoords(i,'CL').y} V 20`} stroke="#EAB308" strokeWidth="0.5" fill="none" />
              ))}
            </>
          )}
        </svg>
        
        {/* FlipFlops Layer */}
        {ffLabels.map((label, i) => (
          <div 
            key={label} 
            className="absolute" 
            style={{
              left: `${ffLayout[i].left}%`, 
              top: `${ffLayout[i].top}%`,
              width: `${ffLayout[i].width}%`,
              height: `${ffLayout[i].height}%`
            }}>
              <FlipFlop
                id={`FF_${label}`}
                label={label}
                j={jStates[i]}
                k={kStates[i]}
                q={qStates[i]}
                isLabMode={isLabMode && i === 3}
                isHighlighted={highlightedFF.includes(3 - i)}
              />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterDisplay;