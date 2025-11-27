
import React from 'react';

interface Props {
  pitch: number; // Beta (degrees)
  roll: number;  // Gamma (degrees)
  isLevel: boolean;
}

export const Car3D: React.FC<Props> = ({ pitch, roll, isLevel }) => {
  // Dimensions constants (relative units)
  const width = 100;
  const length = 220;
  const height = 60;
  
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '800px' }}>
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
          transformStyle: 'preserve-3d',
          transform: `rotateX(${pitch}deg) rotateY(${roll}deg) rotateZ(0deg)`,
          width: `${width}px`,
          height: `${length}px`,
        }}
      >
        {/* SHADOW (Static plane below the car) */}
        <div 
          className="absolute bg-black/40 blur-xl rounded-full"
          style={{
            width: '140%',
            height: '120%',
            top: '-10%',
            left: '-20%',
            transform: 'translateZ(-60px)', // Below the car
          }}
        />

        {/* CHASSIS GROUP */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            
          {/* BOTTOM FACE */}
          <div 
            className="absolute bg-slate-900 border border-slate-700"
            style={{
              width: `${width}px`,
              height: `${length}px`,
              transform: `translateZ(${-height/2}px)`,
            }}
          />

          {/* TOP FACE (Roof) */}
          <div 
            className="absolute bg-slate-700 border border-slate-600 flex items-center justify-center"
            style={{
              width: `${width}px`,
              height: `${length}px`,
              transform: `translateZ(${height/2}px)`,
            }}
          >
             {/* Roof Racks / Pop top lines */}
             <div className="w-[80%] h-full border-x border-slate-800/50 absolute"></div>
             <div className="w-full h-[60%] border-y border-slate-800/50 absolute top-[20%]"></div>
             
             {/* Integrated Level Bubble on Roof */}
             <div className={`relative w-12 h-12 rounded-full border-2 transition-colors duration-500 flex items-center justify-center bg-slate-800 shadow-inner ${isLevel ? 'border-vw-success' : 'border-white/10'}`}>
                {/* The "Bubble" moves opposite to tilt to simulate physics */}
                <div 
                    className={`w-4 h-4 rounded-full shadow-md transition-all duration-300 ease-out ${isLevel ? 'bg-vw-success shadow-[0_0_10px_#22c55e]' : 'bg-vw-accent'}`}
                    style={{
                        transform: `translate(${-roll * 1.5}px, ${-pitch * 1.5}px)`
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
              transformOrigin: 'top',
              transform: `translateY(0) translateZ(${height/2}px) rotateX(-90deg)`,
            }}
          >
             {/* Headlights */}
             <div className="w-8 h-3 bg-white/80 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
             <div className="w-6 h-2 bg-slate-900 rounded mx-1"></div> {/* Grille */}
             <div className="w-8 h-3 bg-white/80 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          </div>

          {/* BACK FACE */}
          <div 
            className="absolute bg-slate-800 border border-slate-700 flex items-center justify-between px-2"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transformOrigin: 'bottom',
              transform: `translateY(${length}px) translateZ(${height/2}px) rotateX(-90deg)`,
              bottom: 0,
            }}
          >
             {/* Taillights */}
             <div className="w-6 h-4 bg-red-600 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
             <div className="w-8 h-4 bg-slate-950 rounded flex items-center justify-center text-[5px] text-white tracking-widest font-mono">T6</div>
             <div className="w-6 h-4 bg-red-600 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
          </div>

          {/* LEFT FACE */}
          <div 
            className="absolute bg-slate-800 border border-slate-700"
            style={{
              width: `${height}px`,
              height: `${length}px`,
              transformOrigin: 'left',
              transform: `translateX(0) translateZ(${height/2}px) rotateY(-90deg)`,
            }}
          >
              {/* Windows */}
              <div className="absolute top-[10%] left-[10%] h-[30%] w-[80%] bg-blue-900/40 border border-slate-900/50 rounded-sm"></div>
              <div className="absolute bottom-[10%] left-[10%] h-[40%] w-[80%] bg-blue-900/40 border border-slate-900/50 rounded-sm"></div>
          </div>

          {/* RIGHT FACE */}
          <div 
            className="absolute bg-slate-800 border border-slate-700"
            style={{
              width: `${height}px`,
              height: `${length}px`,
              transformOrigin: 'right',
              transform: `translateX(${width}px) translateZ(${height/2}px) rotateY(-90deg)`,
            }}
          >
              {/* Windows */}
              <div className="absolute top-[10%] right-[10%] h-[30%] w-[80%] bg-blue-900/40 border border-slate-900/50 rounded-sm"></div>
              <div className="absolute bottom-[10%] right-[10%] h-[40%] w-[80%] bg-blue-900/40 border border-slate-900/50 rounded-sm"></div>
              {/* Sliding Door Handle */}
              <div className="absolute bottom-[48%] right-[20%] w-1 h-3 bg-black/60 rounded-full"></div>
          </div>
        </div>

        {/* WHEELS (Floating slightly off corners) */}
        {/* Front Left */}
        <div className="absolute w-2 h-8 bg-black rounded-sm transform translate-x-[-4px] translate-y-[20px] translate-z-[-20px]" style={{ transform: `translateX(-5px) translateY(35px) translateZ(${-height/2 + 10}px) rotateY(90deg)` }}></div>
        {/* Front Right */}
        <div className="absolute w-2 h-8 bg-black rounded-sm" style={{ transform: `translateX(${width + 3}px) translateY(35px) translateZ(${-height/2 + 10}px) rotateY(90deg)` }}></div>
        {/* Rear Left */}
        <div className="absolute w-2 h-8 bg-black rounded-sm" style={{ transform: `translateX(-5px) translateY(${length - 45}px) translateZ(${-height/2 + 10}px) rotateY(90deg)` }}></div>
        {/* Rear Right */}
        <div className="absolute w-2 h-8 bg-black rounded-sm" style={{ transform: `translateX(${width + 3}px) translateY(${length - 45}px) translateZ(${-height/2 + 10}px) rotateY(90deg)` }}></div>

      </div>
    </div>
  );
};
