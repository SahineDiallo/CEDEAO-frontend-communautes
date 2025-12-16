import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { PlusCircle, MessageSquare, FilePlus, LogOut } from 'lucide-react'; // Import icons


interface AddDropdownMenuProps {
  setIsModalOpen: (isOpen: boolean) => void; // Function to open/close the modal
  pkId?: string; // Community ID (UUID or string)
  handleLeaveCommunity: (communaute_id: string) => void; // Function to handle leaving the community
  setIsRessourceModalOpen: (isRessourceOpen: boolean) => void;
}
const AddDropdownMenu: React.FC<AddDropdownMenuProps> = ({ setIsModalOpen, pkId, handleLeaveCommunity, setIsRessourceModalOpen }) => {

  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* Dropdown Trigger */}
      <div>
        <Menu.Button
          className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-sm hover:bg-[#e76f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#128C4F]"
          style={{ backgroundColor: '#128C4F' }} // Apply the custom color
        >
          <PlusCircle className="h-5 w-5" /> {/* Add icon for "Ajouter" */}
          Ajouter
        </Menu.Button>
      </div>

      {/* Dropdown Items */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            {/* Add Discussion */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`${
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> {/* Add icon for "Ajouter une discussion" */}
                  Ajouter une discussion
                </button>
              )}
            </Menu.Item>

            {/* Add Resource */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setIsRessourceModalOpen(true)}
                  className={`${
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <FilePlus className="h-4 w-4 mr-2" /> {/* Add icon for "Ajouter une ressource" */}
                  Ajouter une ressource
                </button>
              )}
            </Menu.Item>

            {/* Leave Group */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleLeaveCommunity(pkId!)}
                  className={`${
                    active ? 'bg-red-500 text-white' : 'text-red-600'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <LogOut className="h-4 w-4 mr-2" /> {/* Add icon for "Quitter le groupe" */}
                  Quitter le groupe
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AddDropdownMenu;