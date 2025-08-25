import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <img
        src="https://placehold.co/100x24/000000/FFFFFF?text=Logo"
        alt="Logo"
        width={100}
        height={24}
        className="h-6 w-auto"
      />
      <span className="text-xl font-bold text-gray-800">Academic Portal</span>
    </Link>
  );
};
