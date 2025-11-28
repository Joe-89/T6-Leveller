import React, { useState, useEffect, useMemo } from "react";
import { useSensors } from "./hooks/useSensors";
import { PermissionModal } from "./components/PermissionModal";
import { WheelIndicator } from "./components/WheelIndicator";
import { SettingsPanel } from "./components/SettingsPanel";
import { Car3D } from "./components/Car3D";
import { calculateCorrections } from "./utils/calculations";
import { Wheelbase, CalibrationData } from "./types";
import { T6_DIMENSIONS } from "./constants";

const App: React.FC = () => {
  const { data: sensorData, permissionGranted, requestPermission, isIOS } = useSensors();

  // Lazy initialization: Načteme hodnoty z localStorage HNED při vytváření state.
  // To garantuje, že se aplikace rovnou vykreslí s uloženou kalibrací a modelem.

  const [wheelbase, setWheelbase] = useState<Wheelbase>(() => {
    try {
      const savedWB = localStorage.getItem("t6_wheelbase");
      return (savedWB as Wheelbase) || Wheelbase.SHORT;
    } catch {
      return Wheelbase.SHORT;
    }
  });

  const [calibration, setCalibration] = useState<CalibrationData>(() => {
    try {
      const savedCal = localStorage.getItem("t6_calibration");
      return savedCal ? JSON.parse(savedCal) : { betaOffset: 0, gammaOffset: 0 };
    } catch {
      return { betaOffset: 0, gammaOffset: 0 };
    }
  });

  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // State pro zobrazení velkého úspěšného overlaye
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Automatické skrytí feedback zprávy po 2 sekundách
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Uložení wheelbase
  const handleWheelbaseChange = (wb: Wheelbase) => {
    setWheelbase(wb);
    localStorage.setItem("t6_wheelbase", wb);
  };

  // Kalibrace
  const handleCalibrate = () => {
    const newCal = { betaOffset: sensorData.beta, gammaOffset: sensorData.gamma };
    setCalibration(newCal);
    localStorage.setItem("t6_calibration", JSON.stringify(newCal));
    setFeedback({ message: "Nula úspěšně nastavena!", type: "success" });
  };

  // Reset
  const handleResetCalibration = () => {
    const defaultCal = { betaOffset: 0, gammaOffset: 0 };
    setCalibration(defaultCal);
    localStorage.setItem("t6_calibration", JSON.stringify(defaultCal));
    setFeedback({ message: "Kalibrace resetována.", type: "info" });
  };

  // Výpočty
  const corrections = useMemo(() => {
    return calculateCorrections(sensorData, calibration, T6_DIMENSIONS[wheelbase]);
  }, [sensorData, calibration, wheelbase]);

  // Kontrola, zda je auto v rovině (všechny korekce jsou 0)
  const isLevel = useMemo(() => {
    return corrections.fl === 0 && corrections.fr === 0 && corrections.rl === 0 && corrections.rr === 0;
  }, [corrections]);

  // Logika pro zobrazení a skrytí "Success Overlay" po 2 sekundách
  useEffect(() => {
    if (isLevel) {
      setShowSuccessOverlay(true);
      const timer = setTimeout(() => {
        setShowSuccessOverlay(false);
      }, 2000); // Skrýt po 2 sekundách

      return () => clearTimeout(timer);
    } else {
      setShowSuccessOverlay(false);
    }
  }, [isLevel]);

  // Výpočet relativních úhlů pro zobrazení (po odečtení kalibrace)
  const relativeBeta = sensorData.beta - calibration.betaOffset;
  const relativeGamma = sensorData.gamma - calibration.gammaOffset;

  // Pokud je potřeba povolení (iOS a zatím nemáme)
  if (isIOS && permissionGranted === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-vw-dark text-center">
        <h1 className="text-2xl text-red-500 mb-4 font-bold">Přístup zamítnut</h1>
        <p className="text-gray-400">Pro fungování aplikace musíte povolit přístup k senzorům pohybu.</p>
        <button onClick={() => window.location.reload()} className="mt-8 bg-gray-700 px-6 py-3 rounded-xl">
          Zkusit znovu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vw-dark flex flex-col items-center py-6 px-4 relative overflow-hidden selection:bg-vw-accent selection:text-white">
      {/* Feedback Toast Notification */}
      {feedback && (
        <div
          className={`fixed top-20 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border animate-fade-in-up whitespace-nowrap ${
            feedback.type === "success" ? "bg-vw-success/20 border-vw-success text-vw-success" : "bg-blue-500/20 border-blue-500 text-blue-400"
          }`}
        >
          {feedback.type === "success" ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-semibold text-sm">{feedback.message}</span>
        </div>
      )}

      {/* Modal pro povolení senzorů */}
      {isIOS && permissionGranted === null && <PermissionModal onGrant={requestPermission} />}

      {/* Header */}
      <header className="mb-6 text-center z-10 shrink-0">
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">
          VAN <span className="text-vw-accent">LEVELLER</span>
        </h1>
        <p className="text-gray-400 text-sm">Chytrá vodováha pro měření náklonu a výpočet podložení kol.</p>
        <p className="text-gray-500 text-xs mt-1">Optimalizováno pro vozy VW T5/T6.</p>
      </header>

      {/* Main Visualization Area */}
      <main className="relative w-full max-w-[360px] aspect-[4/5] bg-gray-800/30 rounded-3xl border border-gray-700 shadow-2xl flex items-center justify-center mb-6 shrink-0 overflow-hidden">
        {/* Success Overlay - Zobrazí se, když je vše 0, zmizí po 2s */}
        {showSuccessOverlay && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] animate-pop-in">
            <div className="bg-vw-success text-white p-5 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.5)] mb-4 animate-bounce">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wider drop-shadow-lg">V ROVINĚ</h2>
          </div>
        )}

        {/* 3D Car Model */}
        <Car3D pitch={relativeBeta} roll={relativeGamma} isLevel={isLevel} />

        {/* Wheels Indicators */}
        <WheelIndicator value={corrections.fl} label="LP" positionClass="top-[12%] left-2 z-10" />
        <WheelIndicator value={corrections.fr} label="PP" positionClass="top-[12%] right-2 z-10" />
        <WheelIndicator value={corrections.rl} label="LZ" positionClass="bottom-[12%] left-2 z-10" />
        <WheelIndicator value={corrections.rr} label="PZ" positionClass="bottom-[12%] right-2 z-10" />
      </main>

      {/* Status Info */}
      <div className="flex flex-col items-center mb-4 shrink-0">
        {/* Calibrated Angles */}
        <div className="flex gap-4 text-xs text-gray-500 font-mono">
          <div className="bg-gray-800/50 px-3 py-1 rounded border border-gray-700">
            Přední/Zadní: <span className={`${Math.abs(relativeBeta) < 1 ? "text-vw-success" : "text-gray-300"}`}>{relativeBeta.toFixed(1)}°</span>
          </div>
          <div className="bg-gray-800/50 px-3 py-1 rounded border border-gray-700">
            Pravá/Levá: <span className={`${Math.abs(relativeGamma) < 1 ? "text-vw-success" : "text-gray-300"}`}>{relativeGamma.toFixed(1)}°</span>
          </div>
        </div>

        {/* Raw Sensor Values */}
        <div className="mt-2 flex gap-3 text-[10px] text-gray-600 font-mono opacity-60">
          <span>Raw β: {sensorData.beta.toFixed(1)}°</span>
          <span>Raw γ: {sensorData.gamma.toFixed(1)}°</span>
        </div>
      </div>

      {/* Controls */}
      <SettingsPanel
        currentWheelbase={wheelbase}
        onToggleWheelbase={handleWheelbaseChange}
        onCalibrate={handleCalibrate}
        onReset={handleResetCalibration}
      />
    </div>
  );
};

export default App;
