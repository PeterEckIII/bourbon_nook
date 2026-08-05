import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../auth/context';
import appIcon from '../assets/brand/svg/app-icon.svg';

const navLinkClass =
  'text-amber-100/90 hover:text-amber-50 font-medium tracking-wide transition-colors duration-150 [&.active]:text-amber-50 [&.active]:font-semibold';

const logoutButtonClass =
  'cursor-pointer rounded-md border border-amber-500/40 px-3 py-1.5 text-amber-100/90 font-medium tracking-wide transition-colors duration-150 hover:border-amber-500/70 hover:text-amber-50 hover:bg-amber-600/10';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/bottles', label: 'Bottles' },
  { to: '/reviews', label: 'Reviews' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="relative z-50 bg-linear-to-r from-[#3b1f14] via-[#4a2818] to-[#3b1f14] border-b border-amber-900/40 shadow-md">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-amber-200 hover:text-amber-100 transition-colors"
        >
          <img src={appIcon} alt="" className="h-11 w-11 rounded-lg" />
          <span className="font-caprasimo text-xl text-amber-100">
            Bourbon Nook
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={navLinkClass}>
                {link.label}
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <button
                type="button"
                onClick={logout}
                className={logoutButtonClass}
              >
                Log Out
              </button>
            </li>
          )}
        </ul>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          className="md:hidden flex h-8 w-8 flex-col items-center justify-center gap-1.5 cursor-pointer"
        >
          <span
            className={`block h-0.5 w-6 rounded-full bg-amber-100 transition-transform duration-300 ${
              isOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-amber-100 transition-opacity duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-amber-100 transition-transform duration-300 ${
              isOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 top-16 z-40 md:hidden transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
        <ul
          className={`absolute top-0 right-0 flex h-full w-64 flex-col gap-1 bg-[#3b1f14] px-6 py-6 shadow-xl transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block py-3 text-lg ${navLinkClass}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className={`w-full text-left py-3 text-lg cursor-pointer ${navLinkClass}`}
              >
                Log Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
