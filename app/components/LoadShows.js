"use client";

// Komponenta koja implementira infinite scroll na stranici prikaza određene kategorije.
// Kada se određeni inView ref prikaže na ekranu učitavaju se serije sa sljedeće stranice API-ja.

import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import { fetchGenreShows } from "../lib/action";
import ShowCards from "./ShowCards";

let page = 2;

export default function LoadShows({ genre }) {
  const { ref, inView } = useInView();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (inView) {
      fetchGenreShows(genre, page).then((res) => {
        setData((prev) => [...prev, ...res]);
        page++;
      });
    }
  }, [inView]);

  useEffect(() => {
    setData([]);
    page = 2;
  }, [genre]);

  return (
    <>
      <ShowCards shows={data} />
      <div ref={ref} className="col-span-full flex justify-center p-5">
        <AiOutlineLoading3Quarters className="animate-spin text-white text-3xl" />
      </div>
    </>
  );
}
