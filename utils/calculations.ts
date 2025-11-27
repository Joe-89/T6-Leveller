import { WheelCorrection, SensorValues, CalibrationData, Dimensions } from '../types';
import { DEG_TO_RAD } from '../constants';

/**
 * Vypočítá potřebné podložení pro každé kolo.
 * Princip: Najde "nejvyšší" kolo (které je na nejvyšším bodě terénu) a ostatní kola dopočítá tak,
 * aby byla v rovině s tímto nejvyšším bodem.
 */
export const calculateCorrections = (
  sensor: SensorValues,
  calibration: CalibrationData,
  dims: Dimensions
): WheelCorrection => {
  // Aplikace kalibrace
  const beta = (sensor.beta - calibration.betaOffset) * DEG_TO_RAD;
  const gamma = (sensor.gamma - calibration.gammaOffset) * DEG_TO_RAD;

  // Polovina rozměrů pro výpočet od středu
  const halfL = dims.wheelbase / 2;
  const halfW = dims.trackWidth / 2;

  // Výpočet relativní výšky Z pro každý roh (bez korekce)
  // Rovnice roviny: z = x * sin(gamma) + y * sin(beta)
  // Pozor na orientaci os. Předpokládáme telefon položený displejem nahoru, portrét nebo landscape.
  // Zde předpokládáme orientaci na výšku (Portrait) položenou na rovnou plochu.
  // Beta: náklon dopředu/dozadu. Gamma: náklon doleva/doprava.
  
  // Souřadnice kol (FL: +X, +Y, atd. záleží na orientaci telefonu v autě)
  // Předpoklad: Telefon je položen podélně s autem.
  
  // Z coordinates (height relative to center)
  // FL (Front Left), FR (Front Right), RL (Rear Left), RR (Rear Right)
  const zFL = (halfW * Math.sin(gamma)) + (halfL * Math.sin(beta));
  const zFR = (-halfW * Math.sin(gamma)) + (halfL * Math.sin(beta));
  const zRL = (halfW * Math.sin(gamma)) - (halfL * Math.sin(beta));
  const zRR = (-halfW * Math.sin(gamma)) - (halfL * Math.sin(beta));

  // Najdeme bod, který je "nejvýše" v prostoru (má největší Z).
  // Ve skutečnosti hledáme kolo, které je na "kopci".
  // Pokud je auto nakloněno čumákem dolů, zadní kola jsou "výš". Musíme zvednout předek.
  const maxZ = Math.max(zFL, zFR, zRL, zRR);

  // Rozdíl nejvyššího bodu oproti ostatním bodům je hodnota, o kterou musíme kolo zvednout (podložit).
  // Převod na cm (vstup je v mm, dělíme 10)
  return {
    fl: Math.round((maxZ - zFL) / 10),
    fr: Math.round((maxZ - zFR) / 10),
    rl: Math.round((maxZ - zRL) / 10),
    rr: Math.round((maxZ - zRR) / 10),
  };
};