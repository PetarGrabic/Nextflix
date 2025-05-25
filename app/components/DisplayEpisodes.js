// U ovoj komponenti pomoću Link komponente, broj sezone nadodaje se u URL,
// te pomoću searchParams iščitava se broj sezone i prikazuju se odgovarajuće epizode.
// Na ovaj način ova komponenta može ostati serverska.

import Link from "next/link";
import Image from "next/image";

// Treba zamijeniti određene znakove prije prikaza opisa.
const stripHtml = (html) => {
  return typeof html === "string" ? html.replace(/<[^>]+>/g, "") : "";
};

export default async function EpisodeViewer({ groupedEpisodes, searchParams }) {
  const seasonNumbers = Object.keys(groupedEpisodes)
    .map(Number)
    .sort((a, b) => a - b);
  const selectedSeason = (await searchParams).season || seasonNumbers[0];
  const episodes = groupedEpisodes[selectedSeason] || [];

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold">Episodes</h2>

      {/* Season Switcher */}
      <div className="flex flex-wrap gap-3 mt-5">
        {seasonNumbers.map((season) => (
          <Link
            key={season}
            href={`?season=${season}`}
            scroll={false}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ring-2 bg-neutral-900 ${
              selectedSeason == season ? "ring-indigo-500" : "ring-neutral-700"
            }`}
          >
            Season {season}
          </Link>
        ))}
      </div>

      {/* Episode List */}
      <ul className="space-y-4 mt-5">
        {episodes.map((ep) => (
          <li
            key={`DisplayEpisodes-${ep.id}`}
          >
            <Link href={`/episode/${ep.id}`} className="flex gap-3 border-3 border-neutral-700 rounded-md">
              <div className="relative aspect-[250/140] min-w-[200px] m-1">
                {ep.image?.medium ? (
                  <Image
                    src={ep.image.medium}
                    alt={ep.name}
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 rounded-md">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="py-2">
                <p className="font-medium text-base hover:underline">
                  S{ep.season}E{ep.number}: {ep.name}
                </p>
                <p className="text-sm text-neutral-400 mt-1 line-clamp-4">
                  {stripHtml(ep.summary)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
