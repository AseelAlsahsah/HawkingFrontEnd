export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        {/* Left: social icons */}
        <div className="flex items-center space-x-4 mb-2 md:mb-0">
          <a
            href="https://www.instagram.com/hawkingjewelry1?igsh=cHoyY2prZWpvajg0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-600 transition"
            aria-label="Hawking on Instagram"
          >
            {/* Instagram icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3.5A4.505 4.505 0 0 0 7.5 12 4.505 4.505 0 0 0 12 16.5 4.505 4.505 0 0 0 16.5 12 4.505 4.505 0 0 0 12 7.5zm0 2A2.503 2.503 0 0 1 14.5 12 2.503 2.503 0 0 1 12 14.5 2.503 2.503 0 0 1 9.5 12 2.503 2.503 0 0 1 12 9.5zm4.75-3.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
            </svg>
          </a>

          <a
            href="https://www.facebook.com/share/17XqFvh8iY/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-600 transition"
            aria-label="Hawking on Facebook"
          >
            {/* Facebook icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 3h3a1 1 0 1 0 0-2h-3a5 5 0 0 0-5 5v3H6a1 1 0 1 0 0 2h2v10a1 1 0 1 0 2 0V11h3a1 1 0 1 0 0-2h-3V6a3 3 0 0 1 3-3z" />
            </svg>
          </a>
        </div>

        <p className="text-center md:text-right">
          © {new Date().getFullYear()} Hawking. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
