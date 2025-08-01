// Central list of common nuclear medicine, PET isotopes, and check sources
// Each isotope: { name, symbol, halfLife, halfLifeUnit }
export interface Isotope {
  name: string;
  symbol: string;
  halfLife: number;
  halfLifeUnit: 'minutes' | 'hours' | 'days';
}

export const ISOTOPES: Isotope[] = [
  { name: 'Technetium-99m', symbol: 'Tc-99m', halfLife: 6.01, halfLifeUnit: 'hours' },
  { name: 'Fluorine-18', symbol: 'F-18', halfLife: 109.8, halfLifeUnit: 'minutes' },
  { name: 'Iodine-131', symbol: 'I-131', halfLife: 8.02, halfLifeUnit: 'days' },
  { name: 'Gallium-68', symbol: 'Ga-68', halfLife: 67.7, halfLifeUnit: 'minutes' },
  { name: 'Cobalt-57 (Check Source)', symbol: 'Co-57', halfLife: 271.8, halfLifeUnit: 'days' },
  { name: 'Cesium-137 (Check Source)', symbol: 'Cs-137', halfLife: 11000, halfLifeUnit: 'days' },
  { name: 'Germanium-68 (Check Source)', symbol: 'Ge-68', halfLife: 271, halfLifeUnit: 'days' },
  // Add more as needed
];
