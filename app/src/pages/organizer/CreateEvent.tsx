import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Upload, CheckCircle, LayoutDashboard, Plus, Calendar, Send, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useOrganizer } from '@/context/OrganizerContext';
import { useEvents } from '@/context/EventsContext';
import { categories } from '@/data/mockData';
import type { Event } from '@/types';
import { toast } from 'sonner';

const sidebarLinks = [
  { name: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
  { name: 'Create Event', path: '/organizer/create-event', icon: Plus },
  { name: 'My Events', path: '/organizer/events', icon: Calendar },
];

export default function OrganizerCreateEvent() {
  const location = useLocation();
  const { id: editId } = useParams<{ id?: string }>();
  const isEditMode = !!editId;

  const { addEvent, updateEvent } = useOrganizer();
  const { events: allEvents } = useEvents();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketQty, setTicketQty] = useState('');
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      const event = allEvents.find(e => e.id === editId);
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setDate(event.date);
        setVenue(event.venue);
        setCity(event.city || '');
        setCategory(event.category);
        setTicketPrice(String(event.price || event.ticketTiers?.[0]?.price || ''));
        setTicketQty(String(event.ticketTiers?.[0]?.quantity || event.ticketsRemaining || ''));
        setExistingImageUrl(event.image || '');
      }
    }
  }, [editId, isEditMode, allEvents]);

  const canSubmit = title && description && date && venue && city && category && ticketPrice && ticketQty && (bannerImage || isEditMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    let imageUrl = existingImageUrl || '/event-custom.jpg';
    if (bannerImage) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1200;
              let width = img.width, height = img.height;
              if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
              canvas.width = width; canvas.height = height;
              canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
            img.src = reader.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(bannerImage);
        });
        imageUrl = base64;
      } catch {
        imageUrl = URL.createObjectURL(bannerImage);
      }
    }

    const price = parseInt(ticketPrice) || 0;
    const qty = parseInt(ticketQty) || 0;

    if (isEditMode && editId) {
      // Update existing event
      updateEvent(editId, {
        title,
        description,
        category: category as Event['category'],
        image: imageUrl,
        date,
        venue,
        city,
        price,
        ticketTiers: [{
          id: 'general',
          name: 'General',
          price,
          quantity: qty,
          available: qty,
          description: 'General Admission',
        }],
        ticketsRemaining: qty,
      });
      setIsSubmitting(false);
      setIsCompleted(true);
      toast.success('Event updated successfully!');
    } else {
      // Create new event
      const eventData: Omit<Event, 'id' | 'ticketsRemaining' | 'organizer'> = {
        title,
        description,
        shortDescription: description,
        fullDescription: description,
        category: category as Event['category'],
        image: imageUrl,
        date,
        time: '10:00',
        venue,
        city,
        price,
        isFeatured: false,
        isTrending: false,
        artists: [],
        ticketTiers: [{
          id: 'general',
          name: 'General',
          price,
          quantity: qty,
          available: qty,
          description: 'General Admission',
        }],
        status: 'pending',
        isSeatBased: false,
      };
      addEvent(eventData);
      setIsSubmitting(false);
      setIsCompleted(true);
      toast.success('Event submitted for admin approval!');
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-md mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center"
            >
              {isEditMode
                ? <Edit2 className="w-12 h-12 text-purple-400" />
                : <Send className="w-12 h-12 text-purple-400" />
              }
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {isEditMode ? 'Event Updated!' : 'Event Submitted!'}
            </h1>
            <p className="text-gray-400 mb-2">
              {isEditMode
                ? 'Your event has been updated successfully.'
                : 'Your event has been sent to the admin for approval.'}
            </p>
            <p className="text-gray-500 text-sm mb-8">
              {isEditMode
                ? 'Changes are live in your events list.'
                : 'You\'ll see the status update in "My Events" once the admin reviews it.'}
            </p>
            <div className="flex gap-3">
              <Link to="/organizer" className="flex-1">
                <Button variant="outline" className="w-full border-white/10">Back to Dashboard</Button>
              </Link>
              <Link to="/organizer/events" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500">My Events</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 fixed h-full bg-dark-50 border-r border-white/5">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Organizer</p>
                <p className="text-xs text-gray-500">Portal</p>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 p-4 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Link to="/organizer/events">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white mb-4">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to My Events
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-white">
                {isEditMode ? 'Edit Event' : 'Submit Event'}
              </h1>
              <p className="text-gray-400">
                {isEditMode
                  ? 'Update your event details below.'
                  : 'Your event will be sent to the admin for approval before going live.'}
              </p>
            </motion.div>

            {!isEditMode && (
              <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-purple-300 text-sm">
                  📋 Fill in the event details and upload a banner image. Once submitted, the admin will review and approve your event.
                </p>
              </div>
            )}

            <Card className="bg-dark-50 border-white/5">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event Title */}
                  <div>
                    <Label className="text-gray-400">Event Title *</Label>
                    <Input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Enter event name"
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-gray-400">Description *</Label>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Brief description of the event..."
                      rows={4}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="text-gray-400">Category *</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-xl border transition-all ${category === cat.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                        >
                          <span className="text-sm text-white">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date, Venue & City */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-400">Event Date *</Label>
                      <Input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400">Venue *</Label>
                      <Input
                        value={venue}
                        onChange={e => setVenue(e.target.value)}
                        placeholder="e.g. Army Stadium"
                        className="mt-1 bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400">City *</Label>
                      <Input
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Dhaka"
                        className="mt-1 bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Ticket Price & Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400">Ticket Price (৳) *</Label>
                      <Input
                        type="number"
                        value={ticketPrice}
                        onChange={e => setTicketPrice(e.target.value)}
                        placeholder="e.g. 500"
                        className="mt-1 bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400">Total Tickets *</Label>
                      <Input
                        type="number"
                        value={ticketQty}
                        onChange={e => setTicketQty(e.target.value)}
                        placeholder="e.g. 200"
                        className="mt-1 bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Banner Image */}
                  <div>
                    <Label className="text-gray-400">
                      Event Banner Image {isEditMode ? '(leave empty to keep current)' : '*'}
                    </Label>
                    <div
                      className="mt-2 border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {bannerImage ? (
                        <div className="space-y-3">
                          <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
                          <img
                            src={URL.createObjectURL(bannerImage)}
                            alt="Preview"
                            className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                          />
                          <p className="text-xs text-gray-400">{bannerImage.name}</p>
                          <Button type="button" variant="outline" size="sm" className="border-white/10"
                            onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                            Change Image
                          </Button>
                        </div>
                      ) : existingImageUrl ? (
                        <div className="space-y-3">
                          <img
                            src={existingImageUrl}
                            alt="Current banner"
                            className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                          />
                          <p className="text-xs text-gray-400">Current banner — click to replace</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                          <p className="text-white mb-1">Click to upload banner image</p>
                          <p className="text-gray-500 text-sm">JPG, PNG — Recommended 1920×1080</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file && file.type.startsWith('image/')) setBannerImage(file);
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-6 text-base"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isEditMode ? (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Approval
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
