import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold">Former</h1>
      <p className="text-4xl font-bold">404 - Page Not Found</p>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Link href="/" className="text-blue-500">
        Go back to the home page
      </Link>
    </div>
  );
}
