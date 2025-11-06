
export enum CounterMode {
  MOD16_UP = 'MOD-16 Ascendente',
  MOD16_DOWN = 'MOD-16 Descendente',
  MOD16_UP_DOWN = 'MOD-16 Ascendente/Descendente',
  MOD10_UP = 'MOD-10 Ascendente (Década)',
}

export interface TimingDataPoint {
  time: number;
  CLK: number;
  QD: number;
  QC: number;
  QB: number;
  QA: number;
}
