import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-10 text-gray-600 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">JustBookIt</h3>
            <p className="text-sm">The easiest way to book your activities in Thailand.</p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {/* <li>
                <Link href="#" className="hover:text-gray-900">
                  Find Venues
                </Link>
              </li> */}
              {/* <li>
                <Link href="#" className="hover:text-gray-900">
                  About Us
                </Link>
              </li> */}
              {/* <li>
                <Link href="/faq" className="hover:text-gray-900">
                  FAQs
                </Link>
              </li> */}
              {/* 
              <li>
                <Link href="#" className="hover:text-gray-900">
                  Contact
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} JustBookIt</p>
          <div className="my-8 p-2">
            Made with{" "}
            <Link href="https://alwaysfullybooked.com" className="text-gray-900 hover:text-gray-700" target="_blank" rel="noopener noreferrer">
              <span className="bg-gradient-to-r from-green-500 via-orange-500 to-red-500 bg-clip-text text-transparent">AlwaysFullyBooked</span>
            </Link>
            , the booking engine platform for developers.
          </div>
        </div>
      </div>
    </footer>
  );
}
