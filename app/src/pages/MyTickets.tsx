import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, Download, Share2, CheckCircle, 
  XCircle, RefreshCw, Ticket, QrCode 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTickets } from '@/context/TicketsContext';
import { generateTicketPDF } from '@/utils/ticketPdf';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const QR_RANDOM_BLOCKS = Array.from({ length: 25 }).map((_, i) => ({
  x: 35 + (i % 5) * 8,
  y: 35 + Math.floor(i / 5) * 8,
  width: Math.random() > 0.5 ? 6 : 0,
}));

// QR Code Component
function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="w-32 h-32 mx-auto relative">
        {/* Simulated QR Code Pattern */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect fill="#000" x="0" y="0" width="30" height="30" />
          <rect fill="#fff" x="5" y="5" width="20" height="20" />
          <rect fill="#000" x="10" y="10" width="10" height="10" />
          
          <rect fill="#000" x="70" y="0" width="30" height="30" />
          <rect fill="#fff" x="75" y="5" width="20" height="20" />
          <rect fill="#000" x="80" y="10" width="10" height="10" />
          
          <rect fill="#000" x="0" y="70" width="30" height="30" />
          <rect fill="#fff" x="5" y="75" width="20" height="20" />
          <rect fill="#000" x="10" y="80" width="10" height="10" />
          
          {/* Random pattern (precomputed once at module load) */}
          {QR_RANDOM_BLOCKS.map((block, i) => (
            <rect
              key={i}
              fill="#000"
              x={block.x}
              y={block.y}
              width={block.width}
              height={6}
            />
          ))}
        </svg>
      </div>
      <p className="text-center text-xs text-gray-600 mt-2 font-mono">{value}</p>
    </div>
  );
}

interface TicketCardProps {
  ticket: ReturnType<typeof useTickets>['tickets'][0];
  isActive: boolean;
}

function TicketCard({ ticket, isActive }: TicketCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateTicketPDF(ticket);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket for ${ticket.event.title}`,
          text: `I have a ticket for ${ticket.event.title} on ${formatDate(ticket.event.date)}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      const ticketInfo = `Ticket for ${ticket.event.title}\nDate: ${formatDate(ticket.event.date)}\nTime: ${ticket.event.time}\nVenue: ${ticket.event.venue}\nTicket ID: ${ticket.id}\nQR Code: ${ticket.qrCode}`;
      navigator.clipboard.writeText(ticketInfo).then(() => {
        alert('Ticket information copied to clipboard!');
      });
    }
  };

  const statusConfig = {
    valid: { color: 'bg-green-500', text: 'Valid', icon: CheckCircle },
    used: { color: 'bg-gray-500', text: 'Used', icon: XCircle },
    refunded: { color: 'bg-red-500', text: 'Refunded', icon: RefreshCw },
  };

  const status = statusConfig[ticket.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Ticket Card */}
      <div className="bg-dark-50 rounded-2xl overflow-hidden border border-white/5">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Event Info */}
          <div className="flex-1 p-6">
            <div className="flex items-start gap-4">
              <img
                src={ticket.event.image}
                alt={ticket.event.title}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${status.color} text-white border-0`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.text}
                  </Badge>
                  {ticket.seatNumber && (
                    <Badge variant="outline" className="border-white/10 text-gray-400">
                      Seat: {ticket.seatNumber}
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {ticket.event.title}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>{formatDate(ticket.event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{ticket.event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span>{ticket.event.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Info */}
            <div className="mt-4 p-3 rounded-lg bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-cyan-400" />
                  <span className="text-white">{ticket.tier.name}</span>
                </div>
                <span className="text-cyan-400 font-semibold">৳{ticket.tier.price}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:flex flex-col items-center justify-center px-4">
            <div className="w-px h-full bg-white/10 relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-dark-bg" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-dark-bg" />
            </div>
          </div>

          {/* Right Side - QR Code */}
          <div className="p-6 flex flex-col items-center justify-center bg-white/5">
            {isActive ? (
              <>
                <QRCodeDisplay value={ticket.qrCode} />
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-gray-400 hover:text-white"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {isDownloading ? 'Generating...' : 'PDF'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-gray-400 hover:text-white"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-xl bg-gray-800 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  {ticket.status === 'used' ? 'This ticket has been used' : 'This ticket has been refunded'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyTickets() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { tickets } = useTickets();
  
  const activeTickets = tickets.filter(t => t.status === 'valid');
  const pastTickets = tickets.filter(t => t.status !== 'valid');

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              My <span className="text-gradient">Tickets</span>
            </h1>
            <p className="text-gray-400">
              Manage your event tickets and view your booking history
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: 'Active', value: activeTickets.length, color: 'text-green-400' },
              { label: 'Used', value: pastTickets.filter(t => t.status === 'used').length, color: 'text-gray-400' },
              { label: 'Total', value: tickets.length, color: 'text-cyan-400' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl glass text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Tickets Tabs */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full bg-dark-50 mb-6">
                <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-purple-500">
                  Active ({activeTickets.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="flex-1 data-[state=active]:bg-purple-500">
                  Past ({pastTickets.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {activeTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No active tickets</h3>
                    <p className="text-gray-400 mb-4">Browse events and book your first ticket!</p>
                    <Link to="/events">
                      <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
                        Explore Events
                      </Button>
                    </Link>
                  </div>
                ) : (
                  activeTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} isActive={true} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No past tickets</h3>
                    <p className="text-gray-400">Your ticket history will appear here</p>
                  </div>
                ) : (
                  pastTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} isActive={false} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
