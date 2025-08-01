// Central list of radioactivity and dose units and their conversion factors
// SI base: Bq (becquerel) for activity, Gy (gray) for dose

export type UnitCategory = 'activity' | 'dose';

export interface UnitDef {
  name: string;
  symbol: string;
  category: UnitCategory;
  toSI: (value: number) => number;
  fromSI: (value: number) => number;
}

export const UNITS: UnitDef[] = [
  // Activity
  {
    name: 'Becquerel', symbol: 'Bq', category: 'activity',
    toSI: v => v, fromSI: v => v
  },
  {
    name: 'Curie', symbol: 'Ci', category: 'activity',
    toSI: v => v * 3.7e10, fromSI: v => v / 3.7e10
  },
  {
    name: 'Millicurie', symbol: 'mCi', category: 'activity',
    toSI: v => v * 3.7e7, fromSI: v => v / 3.7e7
  },
  {
    name: 'Microcurie', symbol: 'μCi', category: 'activity',
    toSI: v => v * 3.7e4, fromSI: v => v / 3.7e4
  },
  // Dose
  {
    name: 'Gray', symbol: 'Gy', category: 'dose',
    toSI: v => v, fromSI: v => v
  },
  {
    name: 'Rad', symbol: 'rad', category: 'dose',
    toSI: v => v * 0.01, fromSI: v => v / 0.01
  },
  {
    name: 'Sievert', symbol: 'Sv', category: 'dose',
    toSI: v => v, fromSI: v => v
  },
  {
    name: 'Rem', symbol: 'rem', category: 'dose',
    toSI: v => v * 0.01, fromSI: v => v / 0.01
  },
];
