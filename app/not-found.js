import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8 text-neutral-300 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2 rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600 transition duration-200"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
