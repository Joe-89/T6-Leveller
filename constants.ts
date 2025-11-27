import { Wheelbase, Dimensions } from "./types";

// Rozměry v mm
export const T6_DIMENSIONS: Record<Wheelbase, Dimensions> = {
  [Wheelbase.SHORT]: {
    wheelbase: 3000, // Rozměry v mm
    trackWidth: 1628,
  },
  [Wheelbase.LONG]: {
    wheelbase: 3400,
    trackWidth: 1628,
  },
};

export const DEG_TO_RAD = Math.PI / 180;
export const TOLERANCE_CM = 1.0; // Tolerance for "green" status
