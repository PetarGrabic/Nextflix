"use client";

// Ova komponenta postaje klijentska radi interaktivnosti.
// Prilikom pritiska na "Category" u meniju, prikazuju se žanrovi serija.

import { useState } from "react";
import Link from "next/link";
import { FaList } from "react-icons/fa";

export default function CategoryToggle() {
  const [open, setOpen] = useState(false);

  const categories = [
    "Action",
    "Adventure",
    "Comedy",
    "Crime",
    "Drama",
    "Science-Fiction",
  ];
  // Još potencijalnih kategorija: Family, Romance, Fantasy, Mystery, Thriller.

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-self-center md:justify-self-start gap-3 cursor-pointer hover:text-neutral-300"
        onClick={() => setOpen(!open)}
      >
        <FaList />
        <p className="hidden md:inline">Categories</p>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-65 block" : "max-h-0 hidden md:block"
        }`}
      >
        <ul className="flex flex-col items-center gap-4 mt-4 text-lg text-neutral-300">
          {categories.map((cat) => (
            <li
              key={cat}
              className="hover:text-white cursor-pointer transition"
            >
              <Link href={`/category/${cat.toLowerCase()}`}>
                {cat == "Science-Fiction" ? "Sci-Fi" : cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
