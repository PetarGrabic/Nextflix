// Komponenta izgleda kartica za prikaz serija,
// koristi se na "category" i "search" stranici.

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function ShowCard({ shows }) {
  return shows.map((s) => {
    const show = "score" in s ? s.show : s;
    return (
      <div key={`ShowCards-${show.id}`} className="my-2 rounded-lg bg-neutral-900">
        <Link href={`/show/${show.id}`}>
          <div className="aspect-[210/295] w-full relative">
            {show.image?.medium ? (
              <Image
                src={show.image.medium}
                alt={show.name}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 rounded-lg">
                No Image Available
              </div>
            )}
          </div>
        </Link>
        <p className="flex gap-1 items-center text-md font-semibold mt-2 mx-2 cursor-text">
          <FaStar color="gold" className="cursor-default" />{" "}
          {show.rating.average ?? "N/A"}
        </p>
        <Link href={`/show/${show.id}`}>
          <p className="text-lg font-semibold mx-2 mt-1 mb-3 hover:underline">
            {show.name}
          </p>
        </Link>
      </div>
    );
  });
}
