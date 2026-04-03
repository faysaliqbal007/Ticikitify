import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/context/EventsContext';

export default function TrendingEvents() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { events } = useEvents();

  const trendingEvents = useMemo(() => {
    const live = events.filter(e => e.status === 'live' || e.status === 'approved' || e.status === 'scheduled');
    const trending = live.filter(e => e.isTrending);
    const nonTrending = live.filter(e => !e.isTrending);
    // Always show 4: trending first, fill rest with other live events
    return [...trending, ...nonTrending].slice(0, 4);
  }, [events]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section ref={containerRef} className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-orange-500 font-medium uppercase tracking-wider">Hot Right Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Trending <span className="text-gradient">Events</span>
            </h2>
          </div>
          <Link to="/events">
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
              View All Events
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/events/${event.id}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative bg-dark-50 rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-glow"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {event.isFeatured && (
                        <Badge className="bg-purple-500/80 text-white border-0">
                          Featured
                        </Badge>
                      )}
                      {event.ticketsRemaining < 100 && (
                        <Badge className="bg-red-500/80 text-white border-0">
                          Selling Fast
                        </Badge>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-dark-bg/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <span className="text-lg font-bold text-cyan-400">৳{event.price.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}</span>
                        {event.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ৳{event.originalPrice.toLocaleString('en-US', { notation: "compact", maximumFractionDigits: 1 })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
<<<<<<< HEAD
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                          {event.organizer.name.charAt(0)}
                        </div>
=======
                        {event.organizer.logo ? (
                          <img 
                            src={event.organizer.logo} 
                            alt={event.organizer.name}
                            className="w-6 h-6 rounded-full object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                            {event.organizer.name.charAt(0)}
                          </div>
                        )}
>>>>>>> cc929bc1ffbcaf482aac36df8e71c4e8e23c8788
                        <span className="text-sm text-gray-500 truncate max-w-[100px]">
                          {event.organizer.name}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors"
                      >
                        Get Tickets
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
