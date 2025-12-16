import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from "../utils/Menus";
import { MenuItem } from '../utils/Menus';
import Logo from "/logo_black.png";
// import MobileMenu from "../components/menu/mobile";
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/useAppSelector';
import { ChevronDown, LogOut, Menu as MenuIcon, X, User } from 'lucide-react';
import fr_flag from "/FR.png";
import eng_flag from "/ENG.png";

const MainHeader: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { logout } = useAuth();
  const domain = import.meta.env.VITE_MAIN_DOMAIN;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollPercentage = (scrollPosition / windowHeight) * 100;

      setIsScrolled(scrollPercentage > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle body overflow for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
        isScrolled ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Top Language Bar */}
      <div className="w-full bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-xs sm:text-sm mb-0 font-medium leading-tight text-white">
              Plateforme de l'outil ECOWAS Gender Barometer (ECOGEB)
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-xs sm:text-sm whitespace-nowrap">Langues:</span>
            <Link to="#" className="flex items-center gap-1">
              <img
                src={fr_flag}
                alt="Français"
                width={30}
                height={30}
                className="rounded-full w-8 h-8 sm:w-[30px] sm:h-5 object-cover"
              />
            </Link>
            <Link to="#" className="flex items-center gap-1">
              <img
                src={eng_flag}
                alt="English"
                width={30}
                height={30}
                className="rounded-full w-8 h-8 sm:w-[30px] sm:h-5 object-cover"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white/60 bg-opacity-95 backdrop-blur-xl p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="https://www.dev1.ecogeb.org">
              <img
                src={Logo}
                alt="IEG-CEDEAO Logo"
                className="h-12 w-auto object-contain"
                // priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Using your Menu data */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {Menu.map((item: MenuItem) => {
              // Check if menu item has children (dropdown)
              const hasChildren = item.subMenus && item.subMenus.length > 0;
              
              if (hasChildren) {
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.path}
                      className="flex items-center gap-1 font-medium text-black hover:text-primary transition-colors duration-200"
                    >
                      {item.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1 transition-transform duration-200 group-hover:rotate-180"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Link>
                    {/* Dropdown menu for children */}
                    {item.subMenus && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        {item.subMenus.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular menu item without children
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="font-medium text-black hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
              );
            })}

            {/* User authentication section */}
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user?.profile?.image_url ? (
                    <img
                      src={`${domain}/${user.profile.image_url}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <img
                      src="/default_profile_image.jpg"
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-black">{user?.full_name}</span>
                  <ChevronDown className="w-4 h-4 text-black" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                    <Link
                      to={`/accounts/profile/${user?.pkId}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profil</span>
                      </div>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="font-medium text-black hover:text-primary transition-colors duration-200"
              >
                Se connecter
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Mobile authentication button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user?.profile?.image_url ? (
                    <img
                      src={`${domain}/${user.profile.image_url}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <img
                      src="/default_profile_image.jpg"
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <span className="font-medium">{user?.full_name}</span>
                    </div>
                    <Link
                      to={`/accounts/profile/${user?.pkId}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        closeMobileMenu();
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profil</span>
                      </div>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-black hover:text-primary transition-colors duration-200"
              >
                Se connecter
              </Link>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <MenuIcon className="h-6 w-6 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="pt-4 pb-2 border-t border-gray-200 mt-4">
            <div className="flex flex-col space-y-3">
              {Menu.map((item: MenuItem) => {
                const hasChildren = item.subMenus && item.subMenus.length > 0;
                
                if (hasChildren) {
                  return (
                    <div key={item.name} className="space-y-2">
                      <Link
                        to={item.path}
                        className="font-medium text-black hover:text-primary transition-colors duration-200 py-2 px-2 rounded-md hover:bg-gray-50 block"
                        onClick={closeMobileMenu}
                      >
                        {item.name}
                      </Link>
                      {/* Mobile submenu */}
                      {item.subMenus && (
                        <div className="pl-4 space-y-2">
                          {item.subMenus.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 py-1 px-2 rounded-md hover:bg-gray-50 block"
                              onClick={closeMobileMenu}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="font-medium text-black hover:text-primary transition-colors duration-200 py-2 px-2 rounded-md hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;