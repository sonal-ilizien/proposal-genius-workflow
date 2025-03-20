
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText, BarChart2, Settings, BellIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="relative h-9 w-9 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">P</span>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full"></div>
              </div>
              <span className="font-bold text-xl bg-clip-text">
                ProposalGenius
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link 
                to="/" 
                className={`transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/proposals" 
                className={`transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium ${location.pathname.includes('/proposals') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Proposals
              </Link>
              <Link 
                to="/statistics" 
                className={`transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/statistics' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Statistics
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <BellIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold">
              JS
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? 'block animate-fade-in' : 'hidden'}`}>
        <div className="glass border-t px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link
            to="/proposals"
            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.includes('/proposals') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span>Proposals</span>
            </div>
          </Link>
          <Link
            to="/statistics"
            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/statistics' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            <div className="flex items-center space-x-3">
              <BarChart2 className="h-5 w-5" />
              <span>Statistics</span>
            </div>
          </Link>
          <Link
            to="/settings"
            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/settings' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
