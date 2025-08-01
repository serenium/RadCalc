// Central list of common nuclear medicine, PET isotopes, and check sources
// Each isotope: { name, symbol, halfLife, halfLifeUnit }
export interface Isotope {
  name: string;
  symbol: string;
  halfLife: number;
  halfLifeUnit: 'seconds' | 'minutes' | 'hours' | 'days';
  atomicNumber: number;
  /**
   * Gamma dose constant in μSv·m²/MBq·h (or null if not applicable)
   * Typical values from ICRP, NIST, or medical physics tables.
   */
  doseConstant?: number | null;
}

export const ISOTOPES: Isotope[] = [
  { name: 'Fluorine-18', symbol: 'F-18', halfLife: 109.8, halfLifeUnit: 'minutes', atomicNumber: 9, doseConstant: 0.143 },
  { name: 'Gallium-68', symbol: 'Ga-68', halfLife: 67.7, halfLifeUnit: 'minutes', atomicNumber: 31, doseConstant: 0.174 },
  { name: 'Germanium-68 (Check Source)', symbol: 'Ge-68', halfLife: 271, halfLifeUnit: 'days', atomicNumber: 32, doseConstant: null },
  { name: 'Selenium-75', symbol: 'Se-75', halfLife: 119.8, halfLifeUnit: 'days', atomicNumber: 34, doseConstant: 0.19 },
  { name: 'Krypton-81m', symbol: 'Kr-81m', halfLife: 13.1, halfLifeUnit: 'seconds', atomicNumber: 36, doseConstant: 0.013 },
  { name: 'Rubidium-81', symbol: 'Rb-81', halfLife: 4.58, halfLifeUnit: 'hours', atomicNumber: 37, doseConstant: null },
  { name: 'Molybdenum-99', symbol: 'Mo-99', halfLife: 66, halfLifeUnit: 'hours', atomicNumber: 42, doseConstant: 0.077 },
  { name: 'Technetium-99m', symbol: 'Tc-99m', halfLife: 6.01, halfLifeUnit: 'hours', atomicNumber: 43, doseConstant: 0.142 },
  { name: 'Indium-111', symbol: 'In-111', halfLife: 2.8, halfLifeUnit: 'days', atomicNumber: 49, doseConstant: 0.23 },
  { name: 'Iodine-123', symbol: 'I-123', halfLife: 13.2, halfLifeUnit: 'hours', atomicNumber: 53, doseConstant: 0.19 },
  { name: 'Iodine-131', symbol: 'I-131', halfLife: 8.02, halfLifeUnit: 'days', atomicNumber: 53, doseConstant: 0.56 },
  { name: 'Cobalt-57 (Check Source)', symbol: 'Co-57', halfLife: 271.8, halfLifeUnit: 'days', atomicNumber: 27, doseConstant: 0.022 },
  { name: 'Cesium-137 (Check Source)', symbol: 'Cs-137', halfLife: 11000, halfLifeUnit: 'days', atomicNumber: 55, doseConstant: 0.33 },
  { name: 'Barium-133 (Check Source)', symbol: 'Ba-133', halfLife: 10.52 * 365.25, halfLifeUnit: 'days', atomicNumber: 56, doseConstant: 0.081 },
  // Add more as needed
];
