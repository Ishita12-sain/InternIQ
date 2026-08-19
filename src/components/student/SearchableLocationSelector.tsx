import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, Check, X } from 'lucide-react';

interface SearchableLocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  availableLocations: string[];
}

export const INDIAN_CITIES_LIST = [
  'Mumbai, MH',
  'Pune, MH',
  'Bengaluru, KA',
  'Hyderabad, TS',
  'Delhi NCR',
  'Noida, UP',
  'Gurugram, HR',
  'Chennai, TN',
  'Kolkata, WB',
  'Ahmedabad, GJ',
  'Jaipur, RJ',
  'Indore, MP',
  'Bhopal, MP',
  'Nagpur, MH',
  'Surat, GJ',
  'Lucknow, UP',
  'Chandigarh, PB',
  'Kochi, KL',
  'Thiruvananthapuram, KL',
  'Coimbatore, TN',
  'Vadodara, GJ',
  'Visakhapatnam, AP',
  'Patna, BR',
  'Bhubaneswar, OD',
];

export const SearchableLocationSelector: React.FC<SearchableLocationSelectorProps> = ({
  selectedLocation,
  onLocationChange,
  availableLocations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine cities from mock listings and comprehensive Indian cities master list
  const allCities = Array.from(
    new Set([...availableLocations, ...INDIAN_CITIES_LIST])
  ).sort();

  const filteredCities = allCities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (loc: string) => {
    onLocationChange(loc);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="space-y-1 relative text-left">
      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
        Location
      </label>

      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] cursor-pointer"
      >
        <span className="flex items-center space-x-2 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
          <span className="truncate">
            {selectedLocation === 'All' ? 'All Locations' : selectedLocation}
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
      </button>

      {/* Search Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl z-50 overflow-hidden space-y-2 p-2.5 max-h-72 flex flex-col animate-in fade-in zoom-in-95 duration-150 w-full min-w-[240px]">
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options Scroll List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 max-h-48 text-xs">
            {/* Reset / All Locations option */}
            <div
              onClick={() => handleSelect('All')}
              className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                selectedLocation === 'All'
                  ? 'bg-blue-50 text-[#2563eb] font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>All Locations</span>
              {selectedLocation === 'All' && <Check className="w-4 h-4 text-[#2563eb]" />}
            </div>

            {/* Filtered Cities List */}
            {filteredCities.map((city) => (
              <div
                key={city}
                onClick={() => handleSelect(city)}
                className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                  selectedLocation === city
                    ? 'bg-blue-50 text-[#2563eb] font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{city}</span>
                {selectedLocation === city && <Check className="w-4 h-4 text-[#2563eb]" />}
              </div>
            ))}

            {filteredCities.length === 0 && (
              <div className="p-4 text-center text-slate-400 text-xs font-medium">
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
