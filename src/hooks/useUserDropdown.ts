import { useState, useRef } from 'react';

export function useUserDropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userButtonRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return {
    isDropdownOpen,
    userButtonRef,
    toggleDropdown,
    closeDropdown
  };
}
