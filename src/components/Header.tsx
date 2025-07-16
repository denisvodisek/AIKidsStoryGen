import Link from 'next/link';

interface HeaderProps {
  showAuthButton?: boolean;
}

export default function Header({ showAuthButton = true }: HeaderProps) {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500 shadow-lg">
            <span className="text-xl">✨</span>
          </div>
          <span className="text-2xl font-bold tracking-wide text-white">
            AI Kids Story Gen
          </span>
        </Link>
        {showAuthButton && (
          <div className="flex items-center space-x-4">
            <Link
              href="/auth"
              className="font-medium text-white/90 transition-colors hover:text-yellow-300"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding/step-1"
              className="transform rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-purple-700"
            >
              Start Magic! 🪄
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
