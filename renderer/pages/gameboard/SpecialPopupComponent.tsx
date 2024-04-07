import React, { useState } from "react";

type SpecialPopupProps = {
  text: string;
  onClose: () => void;
};

export default function SpecialPopupComponent({
  text,
  onClose,
}: SpecialPopupProps) {
  return (
    <div className="fixed bg-[#0000003f] top-0 z-2 flex items-center flex-row w-full justify-center h-screen">
      <div className="bg-childBlack rounded-3xl">
        {text}
      </div>
    </div>
  );
}