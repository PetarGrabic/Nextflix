// Stranica za prikaz pojedine epizode
// Dohvaćaju se podatci o odabranoj epizodi,
// ali i o ostalim epizodama serije radi mogućnosti prelaska na prethodnu/sljedeću epizodu.

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ScrollButtons from "@/app/components/ScrollButtons";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await fetch(`https://api.tvmaze.com/episodes/${id}`);
  if (!res.ok) return { title: "Unknown episode" };

  const episode = await res.json();

  return {
    title: episode.name,
    description: stripHtml(episode.summary),
    openGraph: {
      images: episode.image?.original ? [episode.image.original] : [],
    },
  };
}

// Treba zamijeniti određene znakove prije prikaza opisa.
const stripHtml = (html) => {
  return typeof html === "string" ? html.replace(/<[^>]+>/g, "") : "";
};

async function getEpisodeData(id) {
  const res = await fetch(
    `https://api.tvmaze.com/episodes/${id}?embed[]=show&embed[]=guestcast&embed[]=guestcrew`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch data");
  const episode = await res.json();

  const showId = episode._embedded.show.id;

  const newRes = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!newRes.ok) throw new Error("Failed to fetch data");
  const episodeList = await newRes.json();

  return { episode, episodeList };
}

export default async function EpisodePage({ params }) {
  const { id } = await params;
  const { episode, episodeList } = await getEpisodeData(id);

  const show = episode._embedded.show || [];
  const guestcast = episode._embedded.guestcast || [];
  const guestcrew = episode._embedded.guestcrew || [];

  const currentIndex = episodeList.findIndex((ep) => ep.id === episode.id);
  const prevEpisode = currentIndex > 0 ? episodeList[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex < episodeList.length - 1
      ? episodeList[currentIndex + 1]
      : null;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Show page */}
      <Link
        href={`/show/${show.id}`}
        className="hover:underline flex items-center gap-1 mb-5"
      >
        <FaArrowLeft className="text-xl"/> Back to show
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="relative min-w-100 aspect-[642/360] self-center lg:self-start">
          {episode.image ? (
            <Image
              src={episode.image.original}
              alt={episode.name}
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
        <div className="flex flex-col text-pretty">
          <h1 className="text-4xl font-bold">
            S{episode.season}E{episode.number}
            {episode.name && <span>: {episode.name}</span>}
          </h1>
          <p className="mt-7 text-neutral-500">{stripHtml(episode.summary)}</p>
          <div className="mt-3 text-sm text-neutral-300 flex gap-x-1">
            {episode.airdate && (
              <p>
                {/*Slična manipulacija datumom kao i na stranici glumca.*/}
                Aired:{" "}
                {new Date(episode.airdate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {episode.runtime && (
              <>
                <p>|</p>
                <p>
                  {/*Pretvorba trajanja epizode npr. iz "100min" u "1h 40min".*/}
                  {Math.floor(episode.runtime / 60) > 0 &&
                    `${Math.floor(episode.runtime / 60)}h `}
                  {episode.runtime % 60}min
                </p>
              </>
            )}
          </div>

          <div className="mt-3 text-xl text-neutral-300 flex gap-x-2 items-center">
            <FaStar color="gold" />
            {episode.rating?.average ? (
              <p>
                {episode.rating.average}
                <span className="text-neutral-600 text-lg">/10</span>
              </p>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      </div>

      {/* Guestcast */}
      <div className="relative">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Guestcast</h2>
          <ScrollButtons targetId="scroll-container-guestcast" />
        </div>
        <div
          id="scroll-container-guestcast"
          className="flex gap-x-5 mt-2 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {guestcast.map(({ person, character }) => (
            <div key={`episode-${person.id}-${character.id}`} className="w-40">
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

      {/* Guestcrew */}
      <div>
        <h2 className="text-2xl font-semibold">Guestcrew</h2>
        <div className="flex flex-col justify-self-center md:justify-self-start mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 mt-3 list-disc list-inside">
            {guestcrew.map(({ person, guestCrewType }) => (
              <li
                key={`episode-${guestCrewType}-${person.id}`}
                className="text-neutral-200"
              >
                {person.name} –{" "}
                <span className="text-sm text-neutral-600">
                  {guestCrewType}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Previous/Next Episode */}
      <div className="flex justify-between pt-7 pb-1 border-t border-neutral-700">
        {prevEpisode ? (
          <Link
            href={`/episode/${prevEpisode.id}`}
            className="flex items-center gap-1 hover:underline"
          >
            <FaArrowLeft className="text-xl"/> S{prevEpisode.season}E{prevEpisode.number}:{" "}
            {prevEpisode.name}
          </Link>
        ) : (
          <div />
        )}

        {nextEpisode ? (
          <Link
            href={`/episode/${nextEpisode.id}`}
            className="flex items-center gap-1 hover:underline"
          >
            S{nextEpisode.season}E{nextEpisode.number}: {nextEpisode.name}{" "}
            <FaArrowRight className="text-xl"/>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
