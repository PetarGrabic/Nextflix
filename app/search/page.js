// Stranica za pretragu serija u kojoj se pomoću Next.js Form komponente
// korisnikov unos upisuje unutar URL-a, te se iščitava pomoću searchParams.
// Serije se pretražuju pomoću pretrage definirane unutar API-ja.

import Form from "next/form";
import { FaSearch, FaTimes } from "react-icons/fa";
import ShowCards from "../components/ShowCards";

export const metadata = {
  title: "Search",
  description: "Find your favorite tv show."
};

export default async function SearchBox({ searchParams }) {
  const query = (await searchParams).query || "";
  const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch data");

  const shows = await res.json();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form
        action="/search"
        className="flex items-center bg-neutral-800 rounded-md px-4 py-2 gap-2"
      >
        <input
          type="text"
          name="query"
          placeholder="Search for a show..."
          className="bg-transparent outline-none text-white w-full placeholder:text-neutral-400"
        />
        {query && (
          <button type="reset" className="text-neutral-400 hover:text-white">
            <FaTimes />
          </button>
        )}
        <button type="submit" className="text-neutral-400 hover:text-white">
          <FaSearch />
        </button>
      </Form>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10">
        <ShowCards shows={shows} />
      </div>
    </div>
  );
}
