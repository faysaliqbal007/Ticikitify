import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public Pages
import Home from '@/pages/Home';
import Events from '@/pages/Events';
import EventDetails from '@/pages/EventDetails';
import MyTickets from '@/pages/MyTickets';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import VerifyEmail from '@/pages/VerifyEmail';
import Legal from '@/pages/Legal';

// Organizer Pages
import OrganizerDashboard from '@/pages/organizer/Dashboard';
import OrganizerCreateEvent from '@/pages/organizer/CreateEvent';
import OrganizerEvents from '@/pages/organizer/Events';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminCreateEvent from '@/pages/admin/CreateEvent';
import AdminEvents from '@/pages/admin/Events';
import AdminUsers from '@/pages/admin/Users';

import { AuthProvider } from '@/context/AuthContext';
import { OrganizerProvider } from '@/context/OrganizerContext';
import { EventsProvider } from '@/context/EventsContext';
import { TicketsProvider } from '@/context/TicketsContext';

import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <EventsProvider>
          <OrganizerProvider>
            <TicketsProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/my-tickets" element={<MyTickets />} />
                  <Route path="/profile" element={
                    <ProtectedRoute allowedRoles={['customer', 'organizer', 'admin']}>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />

                  {/* Legal Pages */}
                  <Route path="/terms" element={<Legal type="terms" />} />
                  <Route path="/privacy" element={<Legal type="privacy" />} />
                  <Route path="/refund" element={<Legal type="refund" />} />

                  {/* Organizer Routes — only create event and view events */}
                  <Route path="/organizer" element={
                    <ProtectedRoute allowedRoles={['organizer']}>
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/organizer/create-event" element={
                    <ProtectedRoute allowedRoles={['organizer']}>
                      <OrganizerCreateEvent />
                    </ProtectedRoute>
                  } />
                  <Route path="/organizer/edit-event/:id" element={
                    <ProtectedRoute allowedRoles={['organizer']}>
                      <OrganizerCreateEvent />
                    </ProtectedRoute>
                  } />
                  <Route path="/organizer/events" element={
                    <ProtectedRoute allowedRoles={['organizer']}>
                      <OrganizerEvents />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes — separate from organizer */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/create-event" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminCreateEvent />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/edit-event/:id" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminCreateEvent />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/events" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminEvents />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  } />

                  {/* 404 Fallback */}
                  <Route path="*" element={<Home />} />
                </Routes>
                <Toaster />
              </Router>
            </TicketsProvider>
          </OrganizerProvider>
        </EventsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
