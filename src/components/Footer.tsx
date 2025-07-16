import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-20 mt-24 border-t border-white/10 bg-gray-900/80 py-16 text-white backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <span className="text-lg">✨</span>
              </div>
              <span className="text-xl font-bold">AI Kids Story Gen</span>
            </div>
            <p className="text-lg leading-relaxed font-light text-gray-300">
              Creating magical stories for amazing kids everywhere! 🌍✨
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold text-yellow-300">
              Fun Stuff 🎮
            </h4>
            <div className="space-y-2 text-gray-300">
              <Link
                href="/features"
                className="block font-normal transition-colors hover:text-yellow-300"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block font-normal transition-colors hover:text-yellow-300"
              >
                Pricing
              </Link>
              <Link
                href="/examples"
                className="block font-normal transition-colors hover:text-yellow-300"
              >
                Story Examples
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold text-pink-300">
              Help & Support 🤝
            </h4>
            <div className="space-y-2 text-gray-300">
              <Link
                href="/help"
                className="block font-normal transition-colors hover:text-pink-300"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                className="block font-normal transition-colors hover:text-pink-300"
              >
                Contact Us
              </Link>
              <Link
                href="/privacy"
                className="block font-normal transition-colors hover:text-pink-300"
              >
                Privacy & Safety
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold text-purple-300">
              About Us 🏢
            </h4>
            <div className="space-y-2 text-gray-300">
              <Link
                href="/about"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                Blog
              </Link>
              <Link
                href="/careers"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p className="text-lg font-light">
            © 2024 AI Kids Story Gen. Made with ❤️ for amazing kids and
            families!
          </p>
        </div>
      </div>
    </footer>
  );
}
