export enum Wheelbase {
  SHORT = 'SHORT',
  LONG = 'LONG'
}

export interface Dimensions {
  wheelbase: number; // mm
  trackWidth: number; // mm
}

export interface CalibrationData {
  betaOffset: number;
  gammaOffset: number;
}

export interface WheelCorrection {
  fl: number; // Front Left (cm)
  fr: number; // Front Right (cm)
  rl: number; // Rear Left (cm)
  rr: number; // Rear Right (cm)
}

export interface SensorValues {
  beta: number; // Front-to-back tilt (-180 to 180)
  gamma: number; // Left-to-right tilt (-90 to 90)
}