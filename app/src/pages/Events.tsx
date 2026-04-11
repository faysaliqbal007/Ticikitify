import { useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Clock, SlidersHorizontal, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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

const EVENTS_PER_PAGE = 9;

type FilterContentProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  clearFilters: () => void;
};

const FilterContent = ({
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  priceRange,
  setPriceRange,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  sortBy,
  setSortBy,
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

    {/* Date Range */}
    <div>
      <h3 className="text-white font-semibold mb-3">Date Range</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
          />
        </div>
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h3 className="text-white font-semibold mb-3">Price Range</h3>
      <Slider
        value={priceRange}
        onValueChange={(value) => setPriceRange(value as [number, number])}
        max={50000}
        step={100}
        className="mb-4"
      />
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>৳{priceRange[0].toLocaleString()}</span>
        <span>{priceRange[1] >= 50000 ? '৳50K+' : `৳${priceRange[1].toLocaleString()}`}</span>
      </div>
    </div>

    {/* Sort By */}
    <div>
      <h3 className="text-white font-semibold mb-3">Sort By</h3>
      <div className="space-y-2">
        {[
          { id: 'date-asc', label: 'Date (Earliest first)' },
          { id: 'date-desc', label: 'Date (Latest first)' },
          { id: 'price-asc', label: 'Price (Low to High)' },
          { id: 'price-desc', label: 'Price (High to Low)' },
          { id: 'name-asc', label: 'Name (A-Z)' },
        ].map((opt) => (
          <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={sortBy === opt.id}
              onCheckedChange={() => setSortBy(sortBy === opt.id ? 'date-asc' : opt.id)}
              className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
            />
            <span className="text-gray-400 group-hover:text-white transition-colors text-sm">
              {opt.label}
            </span>
          </label>
        ))}
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter, sort, and paginate events
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Only show events that are live
        const isLive = !event.status || event.status === 'live' || event.status === 'scheduled' || event.status === 'approved';
        if (!isLive) return false;

        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.city && event.city.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = !selectedCategory || event.category === selectedCategory;
        const matchesCity = !selectedCity || event.city === selectedCity;
        const matchesPrice = event.price >= priceRange[0] && (priceRange[1] >= 50000 || event.price <= priceRange[1]);

        // Date filters
        let matchesDateFrom = true;
        let matchesDateTo = true;
        if (dateFrom) {
          matchesDateFrom = new Date(event.date) >= new Date(dateFrom);
        }
        if (dateTo) {
          matchesDateTo = new Date(event.date) <= new Date(dateTo);
        }

        return matchesSearch && matchesCategory && matchesCity && matchesPrice && matchesDateFrom && matchesDateTo;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-desc': {
            const dA = new Date(a.date).getTime();
            const dB = new Date(b.date).getTime();
            return (isNaN(dB) ? 0 : dB) - (isNaN(dA) ? 0 : dA);
          }
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.title.localeCompare(b.title);
          case 'date-asc':
          default: {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            return dateA - dateB;
          }
        }
      });
  }, [events, searchQuery, selectedCategory, selectedCity, priceRange, dateFrom, dateTo, sortBy]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEvents = filteredEvents.slice(
    (safePage - 1) * EVENTS_PER_PAGE,
    safePage * EVENTS_PER_PAGE
  );

  // Reset page when filters change
  const handleFilterChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setCurrentPage(1);
  };

  const activeFilterCount = [
    selectedCategory,
    selectedCity,
    dateFrom,
    dateTo,
    priceRange[0] > 0 || priceRange[1] < 50000 ? 'price' : '',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setPriceRange([0, 50000]);
    setDateFrom('');
    setDateTo('');
    setSortBy('date-asc');
    setCurrentPage(1);
    setSearchParams({});
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Generate page numbers for pagination UI
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
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
                  placeholder="Search events, venues, or cities..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-12 pr-4 py-6 bg-dark-50 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
                />
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="sm:hidden border-white/10 text-white hover:bg-white/5 relative"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-dark-50 border-white/10 h-[85vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent
                      selectedCategory={selectedCategory}
                      setSelectedCategory={handleFilterChange(setSelectedCategory)}
                      selectedCity={selectedCity}
                      setSelectedCity={handleFilterChange(setSelectedCity)}
                      priceRange={priceRange}
                      setPriceRange={handleFilterChange(setPriceRange)}
                      dateFrom={dateFrom}
                      setDateFrom={handleFilterChange(setDateFrom)}
                      dateTo={dateTo}
                      setDateTo={handleFilterChange(setDateTo)}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      clearFilters={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mt-4"
              >
                <span className="text-sm text-gray-500">Active filters:</span>
                {selectedCategory && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-400 cursor-pointer hover:bg-purple-500/30 transition-colors"
                    onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                  >
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {selectedCity && (
                  <Badge
                    variant="secondary"
                    className="bg-cyan-500/20 text-cyan-400 cursor-pointer hover:bg-cyan-500/30 transition-colors"
                    onClick={() => { setSelectedCity(''); setCurrentPage(1); }}
                  >
                    {selectedCity}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {dateFrom && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-400 cursor-pointer hover:bg-green-500/30 transition-colors"
                    onClick={() => { setDateFrom(''); setCurrentPage(1); }}
                  >
                    From: {dateFrom}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {dateTo && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-400 cursor-pointer hover:bg-green-500/30 transition-colors"
                    onClick={() => { setDateTo(''); setCurrentPage(1); }}
                  >
                    To: {dateTo}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-500/20 text-amber-400 cursor-pointer hover:bg-amber-500/30 transition-colors"
                    onClick={() => { setPriceRange([0, 50000]); setCurrentPage(1); }}
                  >
                    ৳{priceRange[0].toLocaleString()} – ৳{priceRange[1] >= 50000 ? '50K+' : priceRange[1].toLocaleString()}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-white transition-colors ml-2"
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
              <div className="sticky top-24 glass rounded-2xl p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <FilterContent
                  selectedCategory={selectedCategory}
                  setSelectedCategory={handleFilterChange(setSelectedCategory)}
                  selectedCity={selectedCity}
                  setSelectedCity={handleFilterChange(setSelectedCity)}
                  priceRange={priceRange}
                  setPriceRange={handleFilterChange(setPriceRange)}
                  dateFrom={dateFrom}
                  setDateFrom={handleFilterChange(setDateFrom)}
                  dateTo={dateTo}
                  setDateTo={handleFilterChange(setDateTo)}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  clearFilters={clearFilters}
                />
              </div>
            </motion.aside>

            {/* Events Grid */}
            <div ref={containerRef} className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-400">
                  Showing <span className="text-white font-semibold">{paginatedEvents.length}</span> of{' '}
                  <span className="text-white font-semibold">{filteredEvents.length}</span> events
                  {totalPages > 1 && (
                    <span className="text-gray-500 ml-1">• Page {safePage} of {totalPages}</span>
                  )}
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
                <>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {paginatedEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link to={`/events/${event.id}`}>
                          <motion.div
                            whileHover={{ y: -8 }}
                            className="group bg-dark-50 rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300"
                          >
                            {/* Image */}
                            <div className="relative h-32 sm:h-48 overflow-hidden">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />

                              {/* Category Badge */}
                              <Badge className="absolute top-3 left-3 bg-purple-500/80 text-white border-0 capitalize">
                                {event.category}
                              </Badge>

                              {/* Price */}
                              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-dark-bg/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                                <span className="text-sm sm:text-lg font-bold text-cyan-400">৳{event.price.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-3 sm:p-5">
                              <h3 className="text-sm sm:text-lg font-semibold text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                {event.title}
                              </h3>

                              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                                  <span className="truncate">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                                  <span className="truncate">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                                  <span className="truncate">{event.venue}{event.city ? `, ${event.city}` : ''}</span>
                                </div>
                              </div>

                              {/* Tickets info */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 pt-2 sm:pt-3 border-t border-white/5">
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  {event.ticketsRemaining > 0 
                                    ? `${event.ticketsRemaining} left`
                                    : 'Sold out'}
                                </span>
                                <span className="text-[10px] sm:text-xs text-purple-400 font-medium group-hover:text-cyan-400 transition-colors">
                                  View Details →
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-10 flex items-center justify-center gap-1 sm:gap-2"
                    >
                      {/* First Page */}
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={safePage === 1}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-white/5"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>

                      {/* Previous Page */}
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-white/5"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Page Numbers */}
                      {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                          <span key={`dots-${idx}`} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500">
                            ⋯
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center border ${
                              safePage === page
                                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-transparent shadow-lg shadow-purple-500/20'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-white/5'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ))}

                      {/* Next Page */}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-white/5"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Last Page */}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={safePage === totalPages}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-white/5"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </>
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
              className="rounded-full bg-purple-500 hover:bg-purple-600 shadow-glow relative"
            >
              <Filter className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-dark-50 border-white/10 h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent
                selectedCategory={selectedCategory}
                setSelectedCategory={handleFilterChange(setSelectedCategory)}
                selectedCity={selectedCity}
                setSelectedCity={handleFilterChange(setSelectedCity)}
                priceRange={priceRange}
                setPriceRange={handleFilterChange(setPriceRange)}
                dateFrom={dateFrom}
                setDateFrom={handleFilterChange(setDateFrom)}
                dateTo={dateTo}
                setDateTo={handleFilterChange(setDateTo)}
                sortBy={sortBy}
                setSortBy={setSortBy}
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
