import { useEffect } from 'react';
import { MenuItem } from '../../utils/Menus';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface MobileMenuProps {
    MobileMenus: MenuItem[];
    isOpen: boolean;
    closeMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ MobileMenus, isOpen, closeMenu }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <div className="lg:hidden flex-center">
            {/* <button className="z-[999] relative text-black" onClick={closeMenu}>
                {isOpen ? <X size={30}/> : <MenuIcon size={30}/>}
            </button> */}

            <div 
                className={`fixed z-[998] h-[calc(100vh-0px)] overflow-y-auto bg-black left-0 right-0 top-[0px] text-white p-6 pt-20 transition-transform duration-300 ${
                    isOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <button 
                    className="absolute top-4 left-4 text-white" 
                    onClick={closeMenu}
                >
                    <X size={30} />
                </button>

                <ul className="flex flex-col gap-5">
                    {MobileMenus.map(({ name, subMenus, path, icon: Icon }, i) => (
                        <li key={i}>
                            <Link 
                                to={path} 
                                className="flex-center gap-2 hover:text-blue-600 transition-colors"
                                onClick={closeMenu}
                            >
                                <Icon />
                                <span>{name}</span>
                            </Link>

                            {subMenus && subMenus.length > 0 && (
                                <ul className="pl-4">
                                    {subMenus.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <Link 
                                                to={subItem.path} 
                                                className="hover:text-blue-500"
                                                onClick={closeMenu}
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MobileMenu;