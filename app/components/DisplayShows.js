// Komponenta za prikaz serija na početnoj stranici.

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import ScrollButtons from "./ScrollButtons";

export default function DisplayShows({ title, shows }) {
  return (
    <div className="relative mb-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <ScrollButtons
          targetId={`scroll-container-${title
            .split(" ")
            .join("")
            .toLowerCase()}`}
        />
      </div>
      {/*Div sa serijama dobiva svoj id kako bi se s njime moglo manipulirati unutar klijentske komponente "ScrollButtons".*/}
      <div
        id={`scroll-container-${title.split(" ").join("").toLowerCase()}`}
        className="flex gap-x-5 mt-2 overflow-x-scroll scrollbar-hide scroll-smooth"
      >
        {shows.map((show) => (
          <div key={`DisplayShows-${show.id}`} className="w-40 mt-1">
            <Link href={`/show/${show.id}`}>
              <div className="relative w-40 aspect-[210/295]">
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
            <p className="flex gap-1 items-center mt-1 mx-2 cursor-text">
              <FaStar color="gold" className="cursor-default" />{" "}
              {show.rating.average ?? "N/A"}
            </p>
            <Link href={`/show/${show.id}`}>
              <p className="font-semibold mx-2 hover:underline">{show.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
