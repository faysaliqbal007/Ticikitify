import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  MapPin, Calendar, Clock, ChevronLeft, Plus, Minus,
  AlertCircle, Share2, Heart, CheckCircle, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useEvents } from '@/context/EventsContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


interface TicketSelection {
  [tierId: string]: number;
}

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { events } = useEvents();
  const { user } = useAuth();

  const event = events.find(e => e.id === id);
  const [ticketSelection, setTicketSelection] = useState<TicketSelection>({});
  const [isLiked, setIsLiked] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalTickets = Object.values(ticketSelection).reduce((a, b) => a + b, 0);
  const totalAmount = event.ticketTiers.reduce((sum, tier) => {
    return sum + (ticketSelection[tier.id] || 0) * tier.price;
  }, 0);

  const updateTicketCount = (tierId: string, delta: number) => {
    setTicketSelection(prev => {
      const current = prev[tierId] || 0;
      const newCount = Math.max(0, current + delta);
      if (newCount === 0) {
        const updated = { ...prev };
        delete updated[tierId];
        return updated;
      }
      return { ...prev, [tierId]: newCount };
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };


  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="pt-20">
        {/* Hero Banner */}
        <div className="relative h-[50vh] min-h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/80 via-transparent to-dark-bg/80" />

          {/* Back Button */}
          <div className="absolute top-6 left-4 sm:left-8 z-10">
            <Link to="/events">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Events
              </Button>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-4 sm:right-8 flex gap-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={`${isLiked ? 'text-red-500' : 'text-white'} hover:bg-white/10`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 bg-purple-500/80 text-white border-0 capitalize">
                  {event.category}
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span>{event.venue}, {event.city}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="lg:col-span-2 space-y-8"
            >
              {/* About Event */}
              <div className="bg-dark-50 rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-semibold text-white mb-4">About Event</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {[
                    { label: 'Date', value: formatDate(event.date) },
                    { label: 'Time', value: event.time },
                    { label: 'Venue', value: event.venue },
                    { label: 'City', value: event.city },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-white/5">
                      <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artist Lineup */}
              {event.artists && event.artists.length > 0 && (
                <div className="bg-dark-50 rounded-2xl p-6 border border-white/5">
                  <h2 className="text-xl font-semibold text-white mb-4">Artist Lineup</h2>
                  <div className="flex flex-wrap gap-4">
                    {event.artists.map((artist) => (
                      <motion.div
                        key={artist.id}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <Avatar className="w-12 h-12 border-2 border-purple-500/30">
                          <AvatarImage src={artist.image} alt={artist.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                            {artist.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{artist.name}</p>
                          <p className="text-sm text-gray-500">{artist.role}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer Info */}
              <div className="bg-dark-50 rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-semibold text-white mb-4">Organizer</h2>
                <div className="flex items-start gap-4">
                  {event.organizer.logo ? (
                    <img 
                      src={event.organizer.logo} 
                      alt={event.organizer.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-white/10"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      {event.organizer.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{event.organizer.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{event.organizer.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">{event.organizer.rating}</span>
                      </div>
                      <span className="text-gray-500">{event.organizer.eventsCount} events</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue Map Placeholder */}
              <div className="bg-dark-50 rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-semibold text-white mb-4">Venue Location</h2>
                <div className="aspect-video rounded-xl bg-white/5 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                    <p className="text-white font-medium">{event.venue}</p>
                    <p className="text-gray-500 text-sm">{event.city}, Bangladesh</p>
                    <Button variant="outline" size="sm" className="mt-4 border-white/10">
                      Open in Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Ticket Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <div className="bg-dark-50 rounded-2xl p-6 border border-white/5">
                  <h2 className="text-xl font-semibold text-white mb-4">Select Tickets</h2>

                  {/* Urgency Badge */}
                  {event.ticketsRemaining < 100 && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 mb-4">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-400 text-sm">
                        Only {event.ticketsRemaining} tickets remaining!
                      </span>
                    </div>
                  )}

                  {/* Ticket Tiers */}
                  <div className="space-y-4 mb-6">
                    {event.ticketTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={`p-4 rounded-xl border transition-all ${ticketSelection[tier.id]
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/5 bg-white/5'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white font-medium">{tier.name}</h3>
                            <p className="text-sm text-gray-500">{tier.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-cyan-400 font-bold">৳{tier.price}</p>
                            <p className="text-xs text-gray-500">{tier.available} left</p>
                          </div>
                        </div>

                        {/* Counter */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateTicketCount(tier.id, -1)}
                              disabled={!ticketSelection[tier.id]}
                              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white font-medium w-6 text-center">
                              {ticketSelection[tier.id] || 0}
                            </span>
                            <button
                              onClick={() => updateTicketCount(tier.id, 1)}
                              disabled={(ticketSelection[tier.id] || 0) >= tier.available}
                              className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white disabled:opacity-30 hover:bg-purple-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {ticketSelection[tier.id] > 0 && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/10 my-4" />

                  {/* Total */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Total ({totalTickets} tickets)</span>
                    <span className="text-xl font-bold text-white">৳{totalAmount}</span>
                  </div>

                  {/* Proceed Button — Coming Soon for users */}
                  {user && (user.role === 'admin' || user.role === 'organizer') ? (
                    <div className="w-full py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-gray-400 text-sm">Admins & Organizers cannot purchase tickets.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        disabled
                        className="w-full bg-gradient-to-r from-purple-500/50 to-cyan-500/50 text-white/70 py-6 text-lg font-semibold rounded-xl cursor-not-allowed"
                      >
                        🔒 Buy Ticket — Coming Soon
                      </Button>
                      <p className="text-center text-xs text-gray-500">
                        Ticket purchasing will be available in the next update!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-50 border-t border-white/10 p-4 z-50">
        <Button
          disabled
          className="w-full bg-gradient-to-r from-purple-500/50 to-cyan-500/50 text-white/70 py-6 rounded-xl cursor-not-allowed"
        >
          🔒 Buy Ticket — Coming Soon
        </Button>
      </div>

      <div className="lg:hidden h-24" /> {/* Spacer for mobile CTA */}
      <Footer />
    </div>
  );
}
