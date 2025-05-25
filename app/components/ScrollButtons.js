"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ScrollButtons({ targetId }) {
  function scrollFunction(amount) {
    const container = document.getElementById(targetId);
    if (container) {
      container.scrollBy({ left: amount, behavior: "smooth" });
    }
  }

  return (
    <div className="hidden md:flex gap-2">
      <FaChevronLeft
        size={20}
        onClick={() => scrollFunction(-700)}
        className="cursor-pointer hover:text-neutral-300"
      />
      <FaChevronRight
        size={20}
        onClick={() => scrollFunction(700)}
        className="cursor-pointer hover:text-neutral-300"
      />
    </div>
  );
}
