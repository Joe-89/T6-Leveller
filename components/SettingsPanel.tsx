import React, { useState } from "react";
import { Wheelbase } from "../types";

interface Props {
  currentWheelbase: Wheelbase;
  onToggleWheelbase: (wb: Wheelbase) => void;
  onCalibrate: () => void;
  onReset: () => void;
}

export const SettingsPanel: React.FC<Props> = ({ currentWheelbase, onToggleWheelbase, onCalibrate, onReset }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
      <div className="bg-vw-panel p-4 rounded-xl border border-gray-700">
        <label className="block text-xs text-gray-400 uppercase mb-2">Model</label>
        <div className="flex bg-gray-900 rounded-lg p-1 h-14">
          <button
            onClick={() => onToggleWheelbase(Wheelbase.SHORT)}
            className={`flex-1 flex flex-col items-center justify-center rounded-md transition-all ${
              currentWheelbase === Wheelbase.SHORT ? "bg-gray-700 text-white shadow" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="text-sm font-bold leading-none mb-0.5">Short</span>
            <span className="text-[10px] font-mono opacity-70 leading-none">3000 mm</span>
          </button>
          <button
            onClick={() => onToggleWheelbase(Wheelbase.LONG)}
            className={`flex-1 flex flex-col items-center justify-center rounded-md transition-all ${
              currentWheelbase === Wheelbase.LONG ? "bg-gray-700 text-white shadow" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="text-sm font-bold leading-none mb-0.5">Long</span>
            <span className="text-[10px] font-mono opacity-70 leading-none">3400 mm</span>
          </button>
        </div>
      </div>

      <div className="bg-vw-panel p-4 rounded-xl border border-gray-700 flex flex-col gap-2 justify-center relative">
        {/* Tooltip */}
        {showInfo && (
          <div className="absolute bottom-[calc(100%+10px)] right-0 left-[-50px] bg-gray-800 text-xs text-gray-200 p-3 rounded-lg border border-gray-600 shadow-xl z-30 animate-fade-in-up">
            <p className="leading-tight">
              Položte a zafixujte telefon na pevné ploše v autě (např. držák telefonu). Stisknutím tlačítka nastavíte aktuální náklon jako "rovinu".
              !Pozor! - Horní hrana telefonu je pořád předek auta i pokud je telefon v horizontální poloze.
            </p>
            <div className="absolute bottom-[-5px] right-6 w-2 h-2 bg-gray-800 border-b border-r border-gray-600 transform rotate-45"></div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onCalibrate}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors border border-gray-600"
          >
            Kalibrovat nulu
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            className={`w-10 flex items-center justify-center rounded-lg border transition-colors ${
              showInfo ? "bg-vw-accent text-white border-vw-accent" : "bg-gray-800 hover:bg-gray-700 text-gray-400 border-gray-600"
            }`}
            aria-label="Info o kalibraci"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <button onClick={onReset} className="w-full text-gray-500 hover:text-white py-1 text-xs transition-colors">
          Resetovat
        </button>
      </div>
    </div>
  );
};
