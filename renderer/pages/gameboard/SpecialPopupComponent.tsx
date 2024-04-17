import React, { useState } from "react";

type SpecialPopupProps = {
  text: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function SpecialPopupComponent({
  text,
  onClose,
  isOpen,
}: SpecialPopupProps) {
  return (
    <div className="absolute bg-[#0000004f] top-0 left-0 z-2 flex items-center flex-row w-full justify-center h-screen z-10">
      <div className="bg-childBlack rounded-3xl p-10 flex flex-col">
        <div className="text-white text-5xl">Specjalne pole</div>
        <div className="text-white text-3xl">{text}</div>
      </div>
    </div>
  );
}