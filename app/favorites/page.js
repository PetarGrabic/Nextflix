"use client";

// Stranica za prikaz favorita.
// Favoriti se dohvaćaju iz vlastite API rute.

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import ScrollButtons from "../components/ScrollButtons";
import { getFavoriteShows, removeFavoriteShow } from "../lib/favorites";

export default function FavoritesPage() {
  const [favoriteShows, setFavoriteShows] = useState([]);

  useEffect(() => {
    getFavoriteShows().then(setFavoriteShows);
  }, []);

  const handleRemoveShow = async (id) => {
    await removeFavoriteShow(id);
    setFavoriteShows(favoriteShows.filter((show) => show.id !== id));
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Favorite shows</h2>
        <ScrollButtons targetId="scroll-container-favoriteShows" />
      </div>
      {favoriteShows.length === 0 ? (
        <p className="justify-self-center text-xl text-neutral-600 mt-10">
          You don't have any favorites yet
        </p>
      ) : (
        <div
          id="scroll-container-favoriteShows"
          className="flex gap-x-5 mt-2 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {favoriteShows.map((show) => (
            <div
              key={`favoriteShow-${show.id}`}
              className="flex flex-col w-50 mt-2"
            >
              <Link href={`../show/${show.id}`}>
                <div className="relative w-50 aspect-[210/295]">
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
              <Link href={`../show/${show.id}`}>
                <p className="font-semibold mx-2 hover:underline">
                  {show.name}
                </p>
              </Link>
              <button
                onClick={() => handleRemoveShow(show.id)}
                className="self-center text-red-500 hover:text-red-700 cursor-pointer mt-2 border-2 border-neutral-800 px-2 pb-1 rounded-full"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
