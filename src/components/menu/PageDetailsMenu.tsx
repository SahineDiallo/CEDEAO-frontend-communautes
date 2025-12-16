import React from 'react';
import { DetailPageMenuItems, MenuItem } from '../../utils/Menus';
import { Link } from 'react-router-dom';

interface PageDetailMenuProps {
    MenuItem: MenuItem;
}

const PageDetailsMenu: React.FC<PageDetailMenuProps> = () => {
  return (
    <div className="flex space-x-4">
      {DetailPageMenuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#e86928]"
          >
            <Icon className="w-5 h-5" /> {/* Render the icon */}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  )
};
  
  export default PageDetailsMenu;