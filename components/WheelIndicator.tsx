import React from 'react';

interface Props {
  value: number; // cm
  label: string;
  positionClass: string;
}

export const WheelIndicator: React.FC<Props> = ({ value, label, positionClass }) => {
  // Barva: Zelená pokud 0 (nebo < 1), oranžová < 4, červená > 4
  let colorClass = "bg-vw-success text-white";
  if (value > 0) colorClass = "bg-vw-warning text-black";
  
  // Logic pro kritickou hodnotu
  const isCritical = value > 5;
  if (isCritical) colorClass = "bg-vw-danger text-white";
  
  if (value === 0) colorClass = "bg-vw-success/20 text-vw-success border-2 border-vw-success";

  return (
    <div className={`absolute flex flex-col items-center gap-1 ${positionClass}`}>
      <div 
        key={value}
        className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-300 animate-scale-up ${isCritical ? 'animate-warning-pulse' : ''} ${colorClass}`}
      >
        <span className="text-3xl font-bold tabular-nums">
          {value}
        </span>
        <span className="text-xs ml-1 font-medium opacity-80">cm</span>
      </div>
      <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold bg-black/30 px-2 py-1 rounded">
        {label}
      </span>
    </div>
  );
};