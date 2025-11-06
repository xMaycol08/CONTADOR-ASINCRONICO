import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimingDataPoint } from '../types';

interface TimingDiagramProps {
  data: TimingDataPoint[];
}

const TimingDiagram: React.FC<TimingDiagramProps> = ({ data }) => {
  const yAxisTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const CustomYAxisTick = (props: any) => {
    const { y, payload } = props;
    let text = '';
    switch(payload.value) {
      case 1: text = 'CLK'; break;
      case 3: text = 'Q_A'; break;
      case 5: text = 'Q_B'; break;
      case 7: text = 'Q_C'; break;
      case 9: text = 'Q_D'; break;
    }
    return (
      <g transform={`translate(0,${y})`}>
        <text x={-10} y={0} dy={4} textAnchor="end" fill="#9CA3AF" fontSize={12} fontWeight="bold">
          {text}
        </text>
      </g>
    );
  };
  
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center text-cyan-400">Diagrama de Tiempos</h2>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="time" stroke="#9CA3AF" type="number" domain={['dataMin', 'dataMax']} allowDecimals={false}/>
            <YAxis stroke="#9CA3AF" ticks={yAxisTicks} tick={<CustomYAxisTick />} domain={[0, 10]}/>
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Legend wrapperStyle={{ color: '#E5E7EB' }}/>
            <Line type="stepAfter" dataKey={d => d.CLK + 0.5} name="CLK" stroke="#FBBF24" strokeWidth={2.5} dot={false} />
            <Line type="stepAfter" dataKey={d => d.QA + 2.5} name="Q_A" stroke="#34D399" strokeWidth={2.5} dot={false} />
            <Line type="stepAfter" dataKey={d => d.QB + 4.5} name="Q_B" stroke="#60A5FA" strokeWidth={2.5} dot={false} />
            <Line type="stepAfter" dataKey={d => d.QC + 6.5} name="Q_C" stroke="#F472B6" strokeWidth={2.5} dot={false} />
            <Line type="stepAfter" dataKey={d => d.QD + 8.5} name="Q_D" stroke="#C084FC" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimingDiagram;
