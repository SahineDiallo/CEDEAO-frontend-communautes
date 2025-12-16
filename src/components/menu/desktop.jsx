import { ChevronDown } from 'lucide-react'
import React from 'react'

const DesktopMenu = ({item}) => {
  const hasSubMenu = menu?.subMenu?.length > 0
  return (
    <li key={item.path}>
      <Link 
        to={item.path} 
        className="flex-center gap-2 hover:text-blue-600 transition-colors"
      >
        <item.icon size={20} />
        <span>
          {item.name}
          {hasSubMenu && <ChevronDown className="mt-0.6px" />}
        </span>
      </Link>
    </li>
  )
}

export default DesktopMenu
