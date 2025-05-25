import { FaBars, FaHome, FaSearch, FaHeart } from "react-icons/fa";
import Link from "next/link";
import CategoryToggle from "./CategoryToggle";

export default function Sidebar() {
  return (
    <aside className="bg-neutral-800 w-auto px-3 py-2.5 text-white rounded-r-md">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <FaBars />
        <p className="hidden md:inline">Menu</p>
      </div>
      <div className="flex flex-col items-center md:items-start pt-12 gap-8 text-xl font-semibold">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer hover:text-neutral-300">
            <FaHome />
            <p className="hidden md:inline">Home</p>
          </div>
        </Link>
        <Link href="/search">
          <div className="flex items-center gap-3 cursor-pointer hover:text-neutral-300">
            <FaSearch />
            <p className="hidden md:inline">Search</p>
          </div>
        </Link>
        <CategoryToggle />
        <Link href="/favorites">
          <div className="flex items-center gap-3 cursor-pointer hover:text-neutral-300">
            <FaHeart />
            <p className="hidden md:inline">Favorites</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
