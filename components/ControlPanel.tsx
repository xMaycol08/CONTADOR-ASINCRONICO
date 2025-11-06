
import React from 'react';
import { CounterMode } from '../types';
import { COUNTER_MODES } from '../constants';

interface ControlPanelProps {
  counterMode: CounterMode;
  setCounterMode: (mode: CounterMode) => void;
  modeM: boolean;
  setModeM: (value: boolean) => void;
  isLabMode: boolean;
  setIsLabMode: (value: boolean) => void;
  onClock: () => void;
  onReset: () => void;
  jA: boolean;
  kA: boolean;
  onJKChange: (type: 'J' | 'K', value: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  counterMode,
  setCounterMode,
  modeM,
  setModeM,
  isLabMode,
  setIsLabMode,
  onClock,
  onReset,
  jA,
  kA,
  onJKChange
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2 text-cyan-400">Panel de Control</h2>
      
      <div>
        <label htmlFor="counter-select" className="block text-sm font-medium text-gray-400 mb-2">Tipo de Contador</label>
        <select
          id="counter-select"
          value={counterMode}
          onChange={(e) => setCounterMode(e.target.value as CounterMode)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
        >
          {COUNTER_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
        </select>
      </div>

      <div className="flex items-center justify-between">
          <span className="font-medium text-gray-400">Modo Laboratorio (FF_A)</span>
          <label htmlFor="lab-mode-toggle" className="inline-flex relative items-center cursor-pointer">
              <input type="checkbox" checked={isLabMode} onChange={(e) => setIsLabMode(e.target.checked)} id="lab-mode-toggle" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
      </div>

      {isLabMode && (
        <div className="bg-gray-700 p-4 rounded-md space-y-4">
          <h3 className="font-semibold text-center text-gray-300">Entradas J-K para FF_A</h3>
          <div className="flex justify-around">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg text-cyan-400">J:</span>
              <button onClick={() => onJKChange('J', !jA)} className={`w-10 h-10 rounded-full text-xl font-bold ${jA ? 'bg-green-500' : 'bg-red-500'}`}>{jA ? 1 : 0}</button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg text-cyan-400">K:</span>
              <button onClick={() => onJKChange('K', !kA)} className={`w-10 h-10 rounded-full text-xl font-bold ${kA ? 'bg-green-500' : 'bg-red-500'}`}>{kA ? 1 : 0}</button>
            </div>
          </div>
        </div>
      )}
      
      {counterMode === CounterMode.MOD16_UP_DOWN && (
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-400">Modo (M)</span>
          <div className="flex items-center space-x-3">
              <span className={`font-semibold ${!modeM ? 'text-cyan-400' : ''}`}>Ascendente</span>
              <label htmlFor="mode-m-toggle" className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" checked={modeM} onChange={(e) => setModeM(e.target.checked)} id="mode-m-toggle" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
              <span className={`font-semibold ${modeM ? 'text-cyan-400' : ''}`}>Descendente</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
        <button
          onClick={onClock}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          CLK (Pulso)
        </button>
        <button
          onClick={onReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          RESET
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
