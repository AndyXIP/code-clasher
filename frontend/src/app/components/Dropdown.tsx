import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'; // Import Next.js Link

export default function Dropdown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-black px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-700 dark:text-white dark:bg-gray-700 dark:ring-gray-600 dark:hover:bg-gray-600">
          Problems
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400 dark:text-gray-300" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black/5 dark:ring-gray-600 focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <Link
              href="/problem/easy"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:text-gray-300"
            >
              Easy
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              href="/problem/medium"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
            >
              Medium
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              href="/problem/hard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
            >
              Hard
            </Link>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
