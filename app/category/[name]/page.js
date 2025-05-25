// Stranica za prikaz serija po kategoriji.

import { fetchGenreShows } from "../../lib/action";
import LoadShows from "@/app/components/LoadShows";
import ShowCards from "@/app/components/ShowCards";

export async function generateMetadata({ params }) {
  const { name } = await params;

  return {
    title: `${
      name == "science-fiction"
        ? "Sci-Fi"
        : name.charAt(0).toUpperCase() + name.slice(1)
    } shows`,
    description: `Browse ${name} shows.`,
  };
}

export default async function Category({ params }) {
  const { name } = await params;
  const data = await fetchGenreShows(name, 1);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <p className="text-3xl font-bold">
        {/*Radi boljeg izgleda preimenovati Science-Fiction (ovako se naziva u apiju) u Sci-Fi.*/}
        {name == "science-fiction"
          ? "Sci-Fi"
          : name.charAt(0).toUpperCase() + name.slice(1)}{" "}
        shows
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7 mt-10">
        <ShowCards shows={data} />
        <LoadShows genre={name} />
      </div>
    </div>
  );
}
