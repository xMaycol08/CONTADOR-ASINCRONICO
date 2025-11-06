
import React, { useState, useCallback, useMemo } from 'react';
import { CounterMode, TimingDataPoint } from './types';
import { COUNTER_MODES } from './constants';
import ControlPanel from './components/ControlPanel';
import CounterDisplay from './components/CounterDisplay';
import TimingDiagram from './components/TimingDiagram';

const App: React.FC = () => {
  const [qStates, setQStates] = useState<boolean[]>([false, false, false, false]); // [QD, QC, QB, QA]
  const [jStates, setJStates] = useState<boolean[]>([true, true, true, true]);
  const [kStates, setKStates] = useState<boolean[]>([true, true, true, true]);
  const [counterMode, setCounterMode] = useState<CounterMode>(CounterMode.MOD16_UP);
  const [modeM, setModeM] = useState<boolean>(false); // false=UP, true=DOWN
  const [isLabMode, setIsLabMode] = useState<boolean>(false);
  const [clockCount, setClockCount] = useState<number>(0);
  const [timingData, setTimingData] = useState<TimingDataPoint[]>([
    { time: 0, CLK: 1, QD: 0, QC: 0, QB: 0, QA: 0 }
  ]);
  const [highlightedFF, setHighlightedFF] = useState<number[]>([]);

  const booleanToNumber = (arr: boolean[]) => arr.map(b => b ? 1 : 0);

  const handleReset = useCallback(() => {
    setQStates([false, false, false, false]);
    setClockCount(0);
    setTimingData([{ time: 0, CLK: 1, QD: 0, QC: 0, QB: 0, QA: 0 }]);
  }, []);

  const handleClockPulse = useCallback(() => {
    let nextQ = [...qStates];
    const prevQ = [...qStates];
    const triggeredFfs: number[] = [];

    // --- FF_A (LSB) ---
    // Triggered by main clock falling edge
    const [ja, ka] = [jStates[3], kStates[3]];
    if (isLabMode) {
      if (!ja && !ka) { /* Hold */ }
      else if (!ja && ka) { nextQ[3] = false; } // Reset
      else if (ja && !ka) { nextQ[3] = true; }  // Set
      else { nextQ[3] = !prevQ[3]; } // Toggle
    } else {
      nextQ[3] = !prevQ[3]; // Always toggle
    }
    if(nextQ[3] !== prevQ[3]) triggeredFfs.push(0);

    const qA_fell = prevQ[3] && !nextQ[3];
    const qA_rose = !prevQ[3] && nextQ[3];

    // --- FF_B ---
    const clkB_triggers = (counterMode === CounterMode.MOD16_UP || counterMode === CounterMode.MOD10_UP) || (counterMode === CounterMode.MOD16_UP_DOWN && !modeM);
    if ((clkB_triggers && qA_fell) || (!clkB_triggers && qA_rose && counterMode !== CounterMode.MOD10_UP)) {
      nextQ[2] = !prevQ[2];
      if(nextQ[2] !== prevQ[2]) triggeredFfs.push(1);
    }
    const qB_fell = prevQ[2] && !nextQ[2];
    const qB_rose = !prevQ[2] && nextQ[2];

    // --- FF_C ---
    const clkC_triggers = (counterMode === CounterMode.MOD16_UP || counterMode === CounterMode.MOD10_UP) || (counterMode === CounterMode.MOD16_UP_DOWN && !modeM);
    if ((clkC_triggers && qB_fell) || (!clkC_triggers && qB_rose && counterMode !== CounterMode.MOD10_UP)) {
      nextQ[1] = !prevQ[1];
      if(nextQ[1] !== prevQ[1]) triggeredFfs.push(2);
    }
    const qC_fell = prevQ[1] && !nextQ[1];
    const qC_rose = !prevQ[1] && nextQ[1];

    // --- FF_D (MSB) ---
    const clkD_triggers = (counterMode === CounterMode.MOD16_UP || counterMode === CounterMode.MOD10_UP) || (counterMode === CounterMode.MOD16_UP_DOWN && !modeM);
    if ((clkD_triggers && qC_fell) || (!clkD_triggers && qC_rose && counterMode !== CounterMode.MOD10_UP)) {
      nextQ[0] = !prevQ[0];
       if(nextQ[0] !== prevQ[0]) triggeredFfs.push(3);
    }

    // --- MOD-10 Asynchronous Reset Logic ---
    // If count reaches 10 (1010), reset immediately
    if (counterMode === CounterMode.MOD10_UP && nextQ[0] && nextQ[2]) {
      nextQ = [false, false, false, false];
    }
    
    setQStates(nextQ);

    // Update Timing Diagram Data
    const newTime = clockCount + 1;
    const [qd, qc, qb, qa] = booleanToNumber(qStates);
    const [next_qd, next_qc, next_qb, next_qa] = booleanToNumber(nextQ);

    const fallingEdgePoint: TimingDataPoint = { time: newTime - 0.5, CLK: 0, QD: qd, QC: qc, QB: qb, QA: qa };
    const newPoint: TimingDataPoint = { time: newTime, CLK: 1, QD: next_qd, QC: next_qc, QB: next_qb, QA: next_qa };
    
    setTimingData(prev => [...prev, fallingEdgePoint, newPoint]);
    setClockCount(newTime);
    
    setHighlightedFF(triggeredFfs);
    setTimeout(() => setHighlightedFF([]), 500);

  }, [qStates, jStates, kStates, counterMode, modeM, isLabMode, clockCount]);
  
  const decimalValue = useMemo(() => {
    return qStates.reduce((acc, bit, index) => acc + (bit ? Math.pow(2, 3 - index) : 0), 0);
  }, [qStates]);

  const handleLabModeToggle = (checked: boolean) => {
    setIsLabMode(checked);
    if (!checked) {
      // Reset J and K to 1 when leaving lab mode
      setJStates([true, true, true, true]);
      setKStates([true, true, true, true]);
    }
  };

  const handleJKChange = (index: number, type: 'J' | 'K', value: boolean) => {
    if(type === 'J') {
      const newJ = [...jStates];
      newJ[index] = value;
      setJStates(newJ);
    } else {
      const newK = [...kStates];
      newK[index] = value;
      setKStates(newK);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Simulador de Contador Asíncrono J-K</h1>
          <p className="text-gray-400 mt-2">Visualiza el comportamiento de contadores de rizo y la propagación de la señal de reloj.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel
              counterMode={counterMode}
              setCounterMode={(mode) => {
                setCounterMode(mode);
                handleReset();
              }}
              modeM={modeM}
              setModeM={setModeM}
              isLabMode={isLabMode}
              setIsLabMode={handleLabModeToggle}
              onClock={handleClockPulse}
              onReset={handleReset}
              jA={jStates[3]}
              kA={kStates[3]}
              onJKChange={(type, value) => handleJKChange(3, type, value)}
            />
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-lg font-semibold text-gray-400">Salida Decimal</h3>
                <p className="text-6xl font-mono font-bold text-white tracking-widest">{decimalValue}</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <CounterDisplay
                qStates={qStates}
                jStates={isLabMode ? jStates : [true, true, true, true]}
                kStates={isLabMode ? kStates : [true, true, true, true]}
                counterMode={counterMode}
                modeM={modeM}
                isLabMode={isLabMode}
                highlightedFF={highlightedFF}
            />
            <TimingDiagram data={timingData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
