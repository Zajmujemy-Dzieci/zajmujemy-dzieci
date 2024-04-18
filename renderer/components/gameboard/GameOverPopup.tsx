import Link from 'next/link';
import React from 'react';

type GameOverPopupProps = {
  onClose: () => void;
  isOpen: boolean;
};

export default function GameOverPopup({ onClose, isOpen }: GameOverPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute bg-[#0000004f] top-0 left-0 z-2 flex items-center flex-row w-full justify-center h-screen z-10">
      <div className="bg-childBlack rounded-3xl p-16 flex flex-col relative">
        <button
          className="absolute top-0 right-0 mr-4 text-white text-4xl"
          onClick={onClose}
        >
          <span className="text-7xl">×</span>
        </button>
        <div className="text-white text-7xl mb-6">Koniec gry</div>
        <Link href="/ranking">
          <a className="btn-blue text-5x1 py-2 px-4 text-4xl">Przejdź do rankingu</a>
        </Link>
      </div>
    </div>
  );
}