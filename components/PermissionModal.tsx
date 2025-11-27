import React from 'react';

interface Props {
  onGrant: () => void;
}

export const PermissionModal: React.FC<Props> = ({ onGrant }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="bg-vw-panel border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
            <svg className="w-16 h-16 text-vw-accent animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Povolení Senzorů</h2>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Pro funkci vodováhy potřebuje aplikace přístup k gyroskopu vašeho iPhone.
        </p>
        <button
          onClick={onGrant}
          className="w-full bg-vw-accent hover:bg-blue-600 active:scale-95 transition-all text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg shadow-blue-500/20"
        >
          Povolit Senzory
        </button>
        <p className="mt-4 text-xs text-gray-500">
            Klikněte a v dialogovém okně zvolte "Povolit" (Allow).
        </p>
      </div>
    </div>
  );
};