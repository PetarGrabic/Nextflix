// Na ovoj stranici dohvaćamo i prikazujemo podatke o pojedinom glumcu,
// te podatke o serijama u kojima je imao ulogu.

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import ScrollButtons from "@/app/components/ScrollButtons";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await fetch(`https://api.tvmaze.com/people/${id}`);
  if (!res.ok) return { title: "Unknown actor" };

  const actor = await res.json();

  return {
    title: actor.name,
    description: `Explore shows ${actor.name} appeared in.`,
    openGraph: {
      images: actor.image?.original ? [actor.image.original] : [],
    },
  };
}

async function getActorData(id) {
  const res = await fetch(`https://api.tvmaze.com/people/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  const actor = await res.json();

  const newRes = await fetch(
    `https://api.tvmaze.com/people/${id}/castcredits?embed=show`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!newRes.ok) throw new Error("Failed to fetch data");
  const shows = await newRes.json();

  return { actor, shows };
}

export default async function ActorPage({ params }) {
  const { id } = await params;
  const { actor, shows } = await getActorData(id);
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="relative min-w-50 aspect-[900/1350] self-center lg:self-start">
          {actor.image ? (
            <Image
              src={actor.image.original}
              alt={actor.name}
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
          <h1 className="text-4xl font-bold">{actor.name}</h1>
          <div className="mt-3 text-sm text-neutral-300 flex gap-x-1">
            {actor.birthday && (
              <p>
                {/*Pretvaranje datuma npr. iz "2000-01-01" u "January 1, 2000".*/}
                Born:{" "}
                {new Date(actor.birthday).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {actor.country?.name && <p> | {actor.country.name}</p>}
          </div>
        </div>
      </div>

      {/* Castcredits */}
      <div className="relative">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Cast credits</h2>
          <ScrollButtons targetId="scroll-container-cast" />
        </div>
        <div
          id="scroll-container-cast"
          className="flex gap-x-5 mt-2 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {shows.map((credit, index) => {
            const show = credit._embedded.show;
            return (
              <div key={`actor-${show.id}-${actor.id}-${index}`} className="w-50">
                <Link href={`/show/${show.id}`}>
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
                <Link href={`/show/${show.id}`}>
                  <p className="font-semibold mx-2 hover:underline">
                    {show.name}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
