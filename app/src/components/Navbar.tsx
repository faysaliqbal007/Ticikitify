import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, User, Ticket, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    ...(user && user.role === 'customer' ? [{ name: 'My Tickets', path: '/my-tickets' }] : []),
    ...(user && user.role === 'organizer' ? [{ name: 'For Organizers', path: '/organizer' }] : []),
    ...(user && user.role === 'admin' ? [{ name: 'Admin Portal', path: '/admin' }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'py-2'
          : 'py-4'
          }`}
      >
        <div
          className={`mx-auto transition-all duration-500 ${isScrolled
            ? 'max-w-4xl px-6 py-2 rounded-full glass-strong mx-4 sm:mx-auto'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8'
            }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-gradient"
              >
                TICIKIFY
              </motion.div>
            </Link>

            {/* Desktop Search */}
            {!isScrolled && (
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </form>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={
                      link.path === '/organizer'
                        ? (e) => {
                          e.preventDefault();
                          if (!user || user.role !== 'organizer') {
                            navigate('/login?type=organizer');
                          } else {
                            navigate('/organizer');
                          }
                        }
                        : undefined
                    }
                    className={`relative text-sm font-medium transition-colors ${isActive(link.path)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full border border-white/10 p-0 overflow-hidden"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-dark-50 border-white/10">
                    <div className="flex items-center gap-2 p-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    {user.role === 'customer' && (
                      <DropdownMenuItem onClick={() => navigate('/my-tickets')} className="cursor-pointer">
                        <Ticket className="mr-2 h-4 w-4" />
                        My Tickets
                      </DropdownMenuItem>
                    )}
                    {user.role === 'organizer' && (
                      <DropdownMenuItem onClick={() => navigate('/organizer')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Organizer Portal
                      </DropdownMenuItem>
                    )}
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Admin Portal
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="cursor-pointer text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-xl pt-20 md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </form>

              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={
                      link.path === '/organizer'
                        ? (e) => {
                          e.preventDefault();
                          setIsMobileMenuOpen(false);
                          if (!user || user.role !== 'organizer') {
                            navigate('/login?type=organizer');
                          } else {
                            navigate('/organizer');
                          }
                        }
                        : () => setIsMobileMenuOpen(false)
                    }
                    className={`block py-3 text-lg font-medium ${isActive(link.path)
                      ? 'text-gradient'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-6 border-t border-white/10">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }}
                      className="w-full border-white/10 text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
