import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Clock, SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { categories, cities } from '@/data/mockData';
import { useEvents } from '@/context/EventsContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type FilterContentProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  clearFilters: () => void;
};

const FilterContent = ({
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  priceRange,
  setPriceRange,
  clearFilters,
}: FilterContentProps) => (
  <div className="space-y-6">
    {/* Categories */}
    <div>
      <h3 className="text-white font-semibold mb-3">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedCategory === category.id}
              onCheckedChange={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? '' : category.id
                )
              }
              className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <span className="text-gray-400 group-hover:text-white transition-colors">
              {category.name}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Cities */}
    <div>
      <h3 className="text-white font-semibold mb-3">Location</h3>
      <div className="space-y-2">
        {cities.map((city) => (
          <label
            key={city}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedCity === city}
              onCheckedChange={() =>
                setSelectedCity(selectedCity === city ? '' : city)
              }
              className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <span className="text-gray-400 group-hover:text-white transition-colors">
              {city}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h3 className="text-white font-semibold mb-3">Price Range</h3>
      <Slider
        value={priceRange}
        onValueChange={(value) => setPriceRange(value as [number, number])}
        max={1000000}
        step={500}
        className="mb-4"
      />
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>৳{priceRange[0].toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}</span>
        <span>{priceRange[1] >= 1000000 ? '৳1M+' : `৳${priceRange[1].toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}`}</span>
      </div>
    </div>

    {/* Clear Filters */}
    <Button
      variant="outline"
      onClick={clearFilters}
      className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
    >
      <X className="w-4 h-4 mr-2" />
      Clear All Filters
    </Button>
  </div>
);

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const { events } = useEvents();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort events - only show live events, sorted by date
  const filteredEvents = events
    .filter((event) => {
      // Only show events that are live or don't have a status (for backward compatibility)
      const isLive = !event.status || event.status === 'live' || event.status === 'scheduled' || event.status === 'approved';
      if (!isLive) return false;

      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      const matchesCity = !selectedCity || event.city === selectedCity;
      const matchesPrice = event.price >= priceRange[0] && (priceRange[1] >= 1000000 || event.price <= priceRange[1]);

      return matchesSearch && matchesCategory && matchesCity && matchesPrice;
    })
    .sort((a, b) => {
      // Sort by date (earliest first)
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      // Handle invalid dates
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateA - dateB;
    });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setPriceRange([0, 1000000]);
    setSearchParams({});
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Discover <span className="text-gradient">Events</span>
            </h1>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events, venues, or artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-6 bg-dark-50 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
                />
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="sm:hidden border-white/10 text-white hover:bg-white/5"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-dark-50 border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      selectedCity={selectedCity}
                      setSelectedCity={setSelectedCity}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      clearFilters={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {(selectedCategory || selectedCity || priceRange[0] > 0 || priceRange[1] < 1000000) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mt-4"
              >
                <span className="text-sm text-gray-500">Active filters:</span>
                {selectedCategory && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-400 cursor-pointer"
                    onClick={() => setSelectedCategory('')}
                  >
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {selectedCity && (
                  <Badge
                    variant="secondary"
                    className="bg-cyan-500/20 text-cyan-400 cursor-pointer"
                    onClick={() => setSelectedCity('')}
                  >
                    {selectedCity}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </motion.div>

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden sm:block w-64 flex-shrink-0"
            >
              <div className="sticky top-24 glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                </div>
                <FilterContent
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  clearFilters={clearFilters}
                />
              </div>
            </motion.aside>

            {/* Events Grid */}
            <div ref={containerRef} className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-400">
                  Showing <span className="text-white font-semibold">{filteredEvents.length}</span> events
                </p>
              </div>

              {filteredEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                  <p className="text-gray-400 mb-4">Try adjusting your filters or search query</p>
                  <Button onClick={clearFilters} variant="outline" className="border-white/10">
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/events/${event.id}`}>
                        <motion.div
                          whileHover={{ y: -8 }}
                          className="group bg-dark-50 rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300"
                        >
 
                            {/* Tickets Remaining */}
                            {event.ticketsRemaining < 100 && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-red-400">
                                  Only {event.ticketsRemaining} tickets left!
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter FAB */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full bg-purple-500 hover:bg-purple-600 shadow-glow"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-dark-50 border-white/10 h-[80vh]">
            <SheetHeader>
              <SheetTitle className="text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto">
              <FilterContent
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                clearFilters={clearFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Footer />
    </div>
  );
}
