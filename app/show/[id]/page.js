// Stranica za prikaz podataka o pojedinoj seriji.
// Također su prikazane epizode serije unutar određene sezone,
// glumci i ostala filmska ekipa.

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import ScrollButtons from "@/app/components/ScrollButtons";
import DisplayEpisodes from "@/app/components/DisplayEpisodes";
import FavoriteShowToggle from "@/app/components/FavoriteShowToggle";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  if (!res.ok) return { title: "Unknown show" };

  const show = await res.json();

  return {
    title: show.name,
    description: stripHtml(show.summary),
    openGraph: {
      images: show.image?.original ? [show.image.original] : [],
    },
  };
}

// Treba zamijeniti određene znakove prije prikaza opisa.
const stripHtml = (html) => {
  return typeof html === "string" ? html.replace(/<[^>]+>/g, "") : "";
};

async function getShowData(id) {
  const res = await fetch(
    `https://api.tvmaze.com/shows/${id}?embed[]=episodes&embed[]=cast&embed[]=crew`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();
  return data;
}

export default async function ShowPage({ params, searchParams }) {
  const { id } = await params;
  const show = await getShowData(id);

  const episodes = show._embedded.episodes || [];
  const cast = show._embedded.cast || [];
  const crew = show._embedded.crew || [];

  const groupedEpisodes = episodes.reduce((acc, episode) => {
    acc[episode.season] = acc[episode.season] || [];
    acc[episode.season].push(episode);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="relative min-w-100 aspect-[1250/1800] self-center lg:self-start">
          {show.image ? (
            <Image
              src={show.image.original}
              alt={show.name}
              fill
              className="object-cover rounded-xl"
              priority
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 rounded-xl">
              No Image Available
            </div>
          )}
        </div>
        <div className="flex flex-col text-wrap">
          <h1 className="text-4xl font-bold">{show.name}</h1>
          <p className="mt-7 text-neutral-500">{stripHtml(show.summary)}</p>
          <div className="mt-3 text-sm text-neutral-300 flex gap-x-1">
            <p>Language: {show.language ?? "N/A"}</p>

            {show.premiered && (
              <p>
                | {show.premiered.slice(0, 4)} -{" "}
                {show.ended ? show.ended.slice(0, 4) : "Present"}
              </p>
            )}

            {show.genres?.length > 0 && <p> | {show.genres.join(" / ")}</p>}
          </div>
          <div className="mt-3 text-xl text-neutral-300 flex gap-x-2 items-center">
            <FaStar color="gold" />
            {show.rating?.average ? (
              <p>
                {show.rating.average}
                <span className="text-neutral-600 text-lg">/10</span>
              </p>
            ) : (
              "N/A"
            )}
          </div>
          <FavoriteShowToggle show={show} />
        </div>
      </div>

      {/* Episodes */}
      <DisplayEpisodes
        groupedEpisodes={groupedEpisodes}
        searchParams={searchParams}
      />

      {/* Cast */}
      <div className="relative">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Cast</h2>
          <ScrollButtons targetId="scroll-container-cast" />
        </div>
        <div
          id="scroll-container-cast"
          className="flex gap-x-5 mt-2 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {cast.map(({ person, character }) => (
            <div key={`show-${person.id}-${character.id}`} className="w-40">
              <Link href={`/actor/${person.id}`}>
                <div className="relative w-40 aspect-[210/295]">
                  {person.image?.medium ? (
                    <Image
                      src={person.image.medium}
                      alt={person.name}
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
              <Link href={`/actor/${person.id}`}>
                <p className="font-medium mt-1 hover:underline">
                  {person.name}
                </p>
              </Link>
              <p className="text-sm text-neutral-500">as {character.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Crew */}
      <div>
        <h2 className="text-2xl font-semibold">Crew</h2>
        <div className="flex flex-col justify-self-center md:justify-self-start mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 mt-3 list-disc list-inside">
            {crew.map(({ type, person }) => (
              <li
                key={`show-${type}-${person.id}`}
                className="text-neutral-200"
              >
                {person.name} –{" "}
                <span className="text-sm text-neutral-600">{type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
