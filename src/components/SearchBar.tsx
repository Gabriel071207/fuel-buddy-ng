import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterToggle: () => void;
}

export default function SearchBar({ value, onChange, onFilterToggle }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search stations or locations..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary text-foreground text-sm 
                     placeholder:text-muted-foreground border-none outline-none 
                     focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>
      <button
        onClick={onFilterToggle}
        className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center 
                   shadow-lg shadow-primary/20 active:scale-95 transition-transform"
      >
        <SlidersHorizontal className="w-4 h-4 text-primary-foreground" />
      </button>
    </div>
  );
}
