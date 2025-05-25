"use client";

// Implementacija opcije dodavanja serije u favorite.

import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavoriteShow, removeFavoriteShow, isFavoritedShow } from "../lib/favorites";

export default function FavoriteShowToggle({ show }) {
  const [favoritedShow, setFavoritedShow] = useState(false);

  useEffect(() => {
    isFavoritedShow(show.id).then(setFavoritedShow);
  }, [show.id]);

  const toggleFavoriteShow = async () => {
    if (favoritedShow) {
      await removeFavoriteShow(show.id);
    } else {
      await addFavoriteShow(show);
    }
    setFavoritedShow(!favoritedShow);
  };

  return (
    <button
      onClick={toggleFavoriteShow}
      className="w-fit bg-neutral-900 border-3 border-neutral-800 rounded-full p-3 mt-3 cursor-pointer"
    >
      {favoritedShow ? (
        <div className="flex items-center gap-2 font-semibold text-2xl">
          <FaHeart />
          <p className="text-base pb-1">Remove from favorites</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 font-semibold text-2xl">
          <FaRegHeart />
          <p className="text-base pb-1">Add to favorites</p>
        </div>
      )}
    </button>
  );
}
