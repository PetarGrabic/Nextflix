"use server";

// ServerAction koji pozivamo unutar klijentske komponente za infinite scroll.

export async function fetchGenreShows(genre, page) {
  const res = await fetch(`https://api.tvmaze.com/shows?page=${page}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  const shows = await res.json();

  return shows
    .filter((show) =>
      show.genres.includes(
        genre == "science-fiction"
          ? "Science-Fiction"
          : genre.charAt(0).toUpperCase() + genre.slice(1)
      )
    )
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
}
