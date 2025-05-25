// Sređivanje interakcije sa vlastitom API rutom,
// radi lakšeg poziva unutar ostalih komponenti.

export async function getFavoriteShows() {
  const res = await fetch("/api/favorites/shows");
  return res.json();
}

export async function addFavoriteShow(show) {
  const body = {
    id: show.id,
    name: show.name,
    image: show.image || null,
    rating: show.rating || { average: null },
  };

  return fetch("/api/favorites/shows", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

export async function removeFavoriteShow(id) {
  return fetch("/api/favorites/shows", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function isFavoritedShow(id) {
  const favoriteShows = await getFavoriteShows();
  return favoriteShows.some((fav) => fav.id === id);
}
