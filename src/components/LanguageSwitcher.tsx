import React, { useState } from "react";

const LanguageSwitcher: React.FC = () => {
  const [language, setLanguage] = useState("Français");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = ["Français", "English"];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsDropdownOpen(false);
    // Ajoutez ici la logique pour changer la langue
    console.log(`Langue sélectionnée : ${lang}`);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Bouton principal */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-orange-500 hover:text-orange-600"
      >
        <span className="text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 0c1.293 0 2.51.305 3.572.844C13.712 4.906 12 7.042 12 9.5s1.712 4.594 3.572 5.656c-1.062.54-2.279.844-3.572.844zm0 0C10.707 3 9.49 3.305 8.428 3.844 10.288 4.906 12 7.042 12 9.5s-1.712 4.594-3.572 5.656C9.49 16.695 10.707 17 12 17z"
            />
          </svg>
        </span>
        <span className="font-medium">{language}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-orange-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </button>

      {/* Menu déroulant */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-50">
          <ul className="py-1">
            {languages.map((lang) => (
              <li
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className="px-4 py-2 text-gray-700 hover:bg-orange-100 cursor-pointer"
              >
                {lang}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
