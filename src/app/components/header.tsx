import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center sm:justify-start h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={42}
                height={42}
                className="rounded-full border border-gray-200"
              />
              <span className="text-gray-800 font-bold text-xl">
                Firefly Starter
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
