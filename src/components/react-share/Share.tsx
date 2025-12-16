import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import { ShareIcon } from 'lucide-react';

const SocialShareDropdown = () => {
  const currentPageUrl = window.location.href;
  const pageTitle = document.title;

  return (
    <Menu as="div" className="fixed top-[55%] right-1 transform -translate-y-1/2 z-50">
      {/* Dropdown Button */}
      <div>
        <Menu.Button className="inline-flex justify-center bg-[#1f7e60] p-3 shadow-lg text-sm font-medium text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700">
            <ShareIcon className='h-5 w-5' />
        </Menu.Button>
      </div>

      {/* Dropdown Items (proche du bouton) */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 right-0 w-auto mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-2 py-2">
            {/* Facebook Share */}
            <Menu.Item>
              {({ active }) => (
                <FacebookShareButton
                  url={currentPageUrl}
                  title={pageTitle}
                  className={`${
                    active ? 'bg-green-500 text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <FacebookIcon size={24} round className="mr-2" />
                </FacebookShareButton>
              )}
            </Menu.Item>

            {/* Twitter */}
            <Menu.Item>
              {({ active }) => (
                <TwitterShareButton
                  url={currentPageUrl}
                  title={pageTitle}
                  className={`${
                    active ? 'bg-green-500 text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <TwitterIcon size={24} round className="mr-2" />
                </TwitterShareButton>
              )}
            </Menu.Item>

            {/* LinkedIn */}
            <Menu.Item>
              {({ active }) => (
                <LinkedinShareButton
                  url={currentPageUrl}
                  title={pageTitle}
                  className={`${
                    active ? 'bg-green-500 text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <LinkedinIcon size={24} round className="mr-2" />
                </LinkedinShareButton>
              )}
            </Menu.Item>

            {/* WhatsApp */}
            <Menu.Item>
              {({ active }) => (
                <WhatsappShareButton
                  url={currentPageUrl}
                  title={pageTitle}
                  className={`${
                    active ? 'bg-green-500 text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <WhatsappIcon size={24} round className="mr-2" />
                </WhatsappShareButton>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SocialShareDropdown;
