import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/ChatGPT_Generated_Logo.png";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: {
    default: "Nextflix",
    template: "%s | Nextflix",
  },
  description:
    "Browse your favorite TV shows, episodes and actors using Nextflix.",
  keywords: [
    "TV shows",
    "Episodes",
    "Actors",
    "Favorite",
    "Action",
    "Adventure",
    "Comedy",
    "Crime",
    "Drama",
    "Sci-Fi",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col bg-neutral-950">
        <header className="flex justify-center py-2 bg-neutral-900">
          <Link href="/">
            <div className="relative w-40 aspect-[783/251]">
              <Image
                src={Logo}
                alt="Nextflix logo"
                fill
                className="object-cover"
              ></Image>
            </div>
          </Link>
        </header>
        <main className="flex flex-1 overflow-hidden my-2.5">
          <Sidebar />
          <div className="flex-1 text-white px-3 py-2.5 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
