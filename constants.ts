import { Wheelbase, Dimensions } from "./types";

export const T6_DIMENSIONS: Record<Wheelbase, Dimensions> = {
  [Wheelbase.SHORT]: {
    // Rozměry v mm
    wheelbase: 3000, // rozvor náprav
    trackWidth: 1628, // rozchod kol
  },
  [Wheelbase.LONG]: {
    wheelbase: 3400,
    trackWidth: 1628,
  },
};

export const DEG_TO_RAD = Math.PI / 180;
export const TOLERANCE_CM = 1.0; // Tolerance for "green" status
