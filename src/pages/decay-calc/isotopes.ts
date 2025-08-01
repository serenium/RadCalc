// Central list of common nuclear medicine, PET isotopes, and check sources
// Each isotope: { name, symbol, halfLife, halfLifeUnit }
export interface Isotope {
  name: string;
  symbol: string;
  halfLife: number;
  halfLifeUnit: 'seconds' | 'minutes' | 'hours' | 'days';
  atomicNumber: number;
}

export const ISOTOPES: Isotope[] = [
  { name: 'Fluorine-18', symbol: 'F-18', halfLife: 109.8, halfLifeUnit: 'minutes', atomicNumber: 9 },
  { name: 'Gallium-68', symbol: 'Ga-68', halfLife: 67.7, halfLifeUnit: 'minutes', atomicNumber: 31 },
  { name: 'Germanium-68 (Check Source)', symbol: 'Ge-68', halfLife: 271, halfLifeUnit: 'days', atomicNumber: 32 },
  { name: 'Selenium-75', symbol: 'Se-75', halfLife: 119.8, halfLifeUnit: 'days', atomicNumber: 34 },
  { name: 'Krypton-81m', symbol: 'Kr-81m', halfLife: 13.1, halfLifeUnit: 'seconds', atomicNumber: 36 },
  { name: 'Rubidium-81', symbol: 'Rb-81', halfLife: 4.58, halfLifeUnit: 'hours', atomicNumber: 37 },
  { name: 'Molybdenum-99', symbol: 'Mo-99', halfLife: 66, halfLifeUnit: 'hours', atomicNumber: 42 },
  { name: 'Technetium-99m', symbol: 'Tc-99m', halfLife: 6.01, halfLifeUnit: 'hours', atomicNumber: 43 },
  { name: 'Indium-111', symbol: 'In-111', halfLife: 2.8, halfLifeUnit: 'days', atomicNumber: 49 },
  { name: 'Iodine-123', symbol: 'I-123', halfLife: 13.2, halfLifeUnit: 'hours', atomicNumber: 53 },
  { name: 'Iodine-131', symbol: 'I-131', halfLife: 8.02, halfLifeUnit: 'days', atomicNumber: 53 },
  { name: 'Cobalt-57 (Check Source)', symbol: 'Co-57', halfLife: 271.8, halfLifeUnit: 'days', atomicNumber: 27 },
  { name: 'Cesium-137 (Check Source)', symbol: 'Cs-137', halfLife: 11000, halfLifeUnit: 'days', atomicNumber: 55 },
  { name: 'Barium-133 (Check Source)', symbol: 'Ba-133', halfLife: 10.52 * 365.25, halfLifeUnit: 'days', atomicNumber: 56 },
  // Add more as needed
];
