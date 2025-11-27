import React from "react";

interface Props {
  pitch: number; // Beta (degrees)
  roll: number; // Gamma (degrees)
  isLevel: boolean;
}

export const Car3D: React.FC<Props> = ({ pitch, roll, isLevel }) => {
  // Dimensions constants (relative units)
  const width = 100;
  const length = 220;
  const height = 60;

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: "800px" }}>
      {/* 
        World Container - Rotates based on sensor data.
        We invert pitch/roll for visual correctness if needed, depending on how the phone is held.
        Assuming Portrait mode:
        - Beta (pitch) tilts Forward/Back -> Rotate X
        - Gamma (roll) tilts Left/Right -> Rotate Y
      */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${pitch}deg) rotateY(${roll}deg) rotateZ(0deg)`,
          width: `${width}px`,
          height: `${length}px`,
        }}
      >
        {/* SHADOW (Static plane below the car) */}
        <div
          className="absolute bg-black/40 blur-xl rounded-full"
          style={{
            width: "140%",
            height: "120%",
            top: "-10%",
            left: "-20%",
            transform: "translateZ(-60px)", // Below the car
          }}
        />

        {/* CHASSIS GROUP */}
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {/* BOTTOM FACE */}
          <div
            className="absolute bg-slate-900 border border-slate-700"
            style={{
              width: `${width}px`,
              height: `${length}px`,
              transform: `translateZ(${-height / 2}px)`,
            }}
          />

          {/* TOP FACE (Roof) */}
          <div
            className="absolute bg-slate-700 border border-slate-600 flex items-center justify-center"
            style={{
              width: `${width}px`,
              height: `${length}px`,
              transform: `translateZ(${height / 2}px)`,
            }}
          >
            {/* Integrated Level Bubble on Roof */}
            <div
              className={`relative w-12 h-12 rounded-full border-2 transition-colors duration-500 flex items-center justify-center bg-slate-800 shadow-inner ${
                isLevel ? "border-vw-success" : "border-white/10"
              }`}
            >
              {/* Center Target/Crosshair */}
              <div className="absolute w-full h-[1px] bg-white/10"></div>
              <div className="absolute h-full w-[1px] bg-white/10"></div>
              <div className="absolute w-3 h-3 rounded-full border border-dashed border-white/20"></div>

              {/* The "Bubble" moves opposite to tilt to simulate physics */}
              <div
                className={`w-4 h-4 rounded-full shadow-md transition-all duration-300 ease-out ${
                  isLevel ? "bg-vw-success shadow-[0_0_10px_#22c55e]" : "bg-vw-accent"
                }`}
                style={{
                  transform: `translate(${-roll * 1.5}px, ${-pitch * 1.5}px)`,
                }}
              ></div>
            </div>
          </div>

          {/* FRONT FACE */}
          <div
            className="absolute bg-slate-800 border border-slate-700 flex items-center justify-between px-2"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transformOrigin: "top",
              transform: `translateY(0) translateZ(${height / 2}px) rotateX(-90deg)`,
            }}
          ></div>

          {/* BACK FACE */}
          <div
            className="absolute bg-slate-800 border border-slate-700 flex items-center justify-between px-2"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transformOrigin: "bottom",
              transform: `translateY(${length}px) translateZ(${height / 2}px) rotateX(-90deg)`,
              bottom: 0,
            }}
          ></div>

          {/* LEFT FACE */}
          <div
            className="absolute bg-slate-800 border border-slate-700"
            style={{
              width: `${height}px`,
              height: `${length}px`,
              transformOrigin: "left",
              transform: `translateX(0) translateZ(${height / 2}px) rotateY(-90deg)`,
            }}
          ></div>
        </div>

        {/* WHEELS (Floating slightly off corners) */}
        {/* Front Left */}
        <div
          className="absolute w-2 h-8 bg-black rounded-sm"
          style={{ transform: `translateX(-5px) translateY(35px) translateZ(${-height / 2 + 10}px) rotateY(90deg)` }}
        ></div>
        {/* Rear Left */}
        <div
          className="absolute w-2 h-8 bg-black rounded-sm"
          style={{ transform: `translateX(-5px) translateY(${length - 45}px) translateZ(${-height / 2 + 10}px) rotateY(90deg)` }}
        ></div>
      </div>
    </div>
  );
};
