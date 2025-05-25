// Iz klijentske komponente nije moguće exportati metadata,
// stoga se taj postupak odvija ovdje.

export const metadata = {
  title: "Favorites",
  description: "A list of your favorite TV shows.",
};

export default function FavoritesLayout({ children }) {
  return <>{children}</>;
}
