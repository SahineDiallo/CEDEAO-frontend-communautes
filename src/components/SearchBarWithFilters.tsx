import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

const SearchComponent = () => {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Options pour les types
  const typeOptions = ["All Types", "News", "Articles", "Videos", "Photos"];

  // Options pour les catégories
  const categoryOptions = [
    "All Categories",
    "Technology",
    "Sports",
    "Business",
    "Entertainment",
  ];

  // États pour la sélection
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Fonction pour gérer la sélection d'un type
  const handleTypeSelect = (type: string) => {
    // Spécification du type ici
    setSelectedType(type);
    setIsTypeOpen(false); // Fermer le menu après la sélection
  };

  // Fonction pour gérer la sélection d'une catégorie
  const handleCategorySelect = (category: string) => {
    // Spécification du type ici
    setSelectedCategory(category);
    setIsCategoryOpen(false); // Fermer le menu après la sélection
  };

  return (
    <div className="max-w-4xl mx-auto h-10">
      <div className="flex items-center bg-white">
        {/* Search input with icon */}
        <div className="relative w-[300px] px-2 border py-0 h-10">
          <input
            type="text"
            placeholder="Search News"
            className="w-full h-full pr-4 text-sm outline-none"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Filter Types */}
        <div className="relative flex items-center w-[255px] pl-3 gap-2 border ml-0 h-10">
          <span className="text-sm text-gray-500">Filter Types</span>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <button
            className="flex items-center gap-1"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
          >
            <span className="text-sm">{selectedType}</span>{" "}
            {/* Affichage du type sélectionné */}
            <ChevronDown className="w-4 h-4 text-gray-400" color="orange" />
          </button>

          {/* Menu déroulant pour Types */}
          {isTypeOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-10">
              {typeOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleTypeSelect(option)} // Gérer la sélection
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Categories */}
        <div className="relative flex items-center gap-2 pl-3">
          <span className="text-sm text-gray-500">Filter Categories</span>
          <div className="h-6 w-px bg-gray-400 mx-2"></div>
          <button
            className="flex items-center gap-1"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className="text-sm">{selectedCategory}</span>{" "}
            {/* Affichage de la catégorie sélectionnée */}
            <ChevronDown className="w-4 h-4 text-gray-400" color="orange" />
          </button>

          {/* Menu déroulant pour Categories */}
          {isCategoryOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-10">
              {categoryOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCategorySelect(option)} // Gérer la sélection
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
