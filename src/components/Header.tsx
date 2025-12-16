import React from "react";
import {  Globe } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#FDF2E9]">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center text-sm text-gray-700">
        <div className="flex items-center space-x-6">
          <span>+221 33 864 77 57</span>
          <span>contact@femmesautonomes.org</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>Données</span>
          <button className="text-black-500">Se connecter</button>
          <div className="flex items-center space-x-2">
          
          <Globe className="w-5 h-5 text-orange-300" />
          <span className="text-orange-300">Français</span>
          </div>
        </div>
      </div>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-auto"
            />
            <ul className="flex space-x-6 text-sm font-medium">
              <li>
                <a href="#" className="text-gray-800 hover:text-orange-500">
                  À Propos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-orange-500">
                  Événements
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-orange-500">
                  Ressources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-orange-500">
                  Multimédias
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-orange-500">
                  Actualités
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-orange-500">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <button className="bg-orange-300 h-[35px] text-white bold py-1 px-4 rounded hover:bg-orange-500 text-sm">
            Rejoignez-nous
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
