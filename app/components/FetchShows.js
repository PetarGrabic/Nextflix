// Dohvaća serije za prikaz na početnoj stranici.
// Dohvaćamo određen broj serija sa prvih nekoliko stranica API-ja.
// ISR zato što podatci o serijama ne trebaju biti trenutni,
// već se ažuriraju u pozadini svakih 60 sekundi.
// ISR je korišten za svaki dohvat podataka iz API-ja.

import DisplayShows from "./DisplayShows";

export default async function FetchShows({ title, page, offset, limit }) {
  const res = await fetch(`https://api.tvmaze.com/shows?page=${page}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch data");

  const shows = await res.json();

  // Serije se filtriraju ovisno imaju li ocjenu,
  // sortiraju od najveće do najmanje ocjene, te se uzima samo određen broj serija.
  const ratedShows = shows
    .filter((show) => show.rating?.average)
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(offset, offset + limit);

  return <DisplayShows title={title} shows={ratedShows} />;
}
