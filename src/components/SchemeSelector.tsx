
import { useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Scheme } from '@/utils/schemeData';
import { useEntranceAnimation, useStaggeredChildren } from '@/utils/animations';

interface SchemeSelectorProps {
  schemes: Scheme[];
  onSelect: (schemeId: string) => void;
  selectedSchemeId?: string;
}

const SchemeSelector = ({ schemes, onSelect, selectedSchemeId }: SchemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Scheme | undefined>(
    selectedSchemeId ? schemes.find(s => s.id === selectedSchemeId) : undefined
  );
  
  const isVisible = useEntranceAnimation();
  const itemDelays = useStaggeredChildren(schemes.length, 50, 100);
  
  useEffect(() => {
    // Update selected scheme when selectedSchemeId prop changes
    if (selectedSchemeId) {
      const scheme = schemes.find(s => s.id === selectedSchemeId);
      if (scheme) setSelected(scheme);
    }
  }, [selectedSchemeId, schemes]);

  const handleSelect = (scheme: Scheme) => {
    setSelected(scheme);
    onSelect(scheme.id);
    setIsOpen(false);
  };

  return (
    <div 
      className={`relative w-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <button
        type="button"
        className="relative w-full glass border rounded-lg px-4 py-3 text-left cursor-pointer hover:bg-white/90 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {selected ? (
              <>
                <div className={`w-3 h-3 rounded-full bg-${selected.color}-500 mr-3`}></div>
                <span className="font-medium">{selected.name}</span>
              </>
            ) : (
              <span className="text-gray-500">Select a scheme</span>
            )}
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </div>
        {selected && (
          <p className="mt-1 text-sm text-gray-500 truncate">{selected.description}</p>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-lg shadow-lg glass border overflow-hidden animate-scale-in">
          <div className="py-1 max-h-60 overflow-auto">
            {schemes.map((scheme, index) => (
              <div
                key={scheme.id}
                className={`cursor-pointer hover:bg-gray-100 transition-all duration-200 ${
                  selected?.id === scheme.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleSelect(scheme)}
                style={{ 
                  animation: `slide-up 0.3s ease-out forwards`,
                  animationDelay: `${itemDelays[index]}ms`,
                  opacity: 0
                }}
              >
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-${scheme.color}-500 mr-3`}></div>
                      <span className="font-medium">{scheme.name}</span>
                    </div>
                    {selected?.id === scheme.id && (
                      <Check className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{scheme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeSelector;
