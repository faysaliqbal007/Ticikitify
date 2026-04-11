import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrganizerInfo() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-8">For Organizers</h1>
        <div className="bg-dark-50 rounded-2xl p-8 border border-white/5 space-y-6 text-gray-300">
          <p className="text-lg">
            Welcome to the Ticikitify Organizer Portal. We provide the tools you need to successfully launch, manage, and scale your events in Bangladesh.
          </p>

          <div className="space-y-6 mt-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">What is the Organizer Portal?</h2>
              <p>
                The Organizer Portal is your dashboard for all things related to your events. Here, you can monitor ticket sales in real time, view attendee demographics, and manage event details—all from an intuitive and secure interface.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">How to Create an Event</h2>
              <p>
                Creating an event is simple. Once you have an organizer account, log in and hit "Create Event." You'll be prompted to provide essential details such as:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Event title, description, and high-quality images.</li>
                <li>Date, time, and location (or online link).</li>
                <li>Ticket types (e.g., VIP, General Admission) and pricing.</li>
              </ul>
              <p className="mt-2">After making sure your details are correct, simply publish it to the platform to start selling tickets!</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Earning Money & Payment Policy</h2>
              <p>
                Ticikitify makes it easy to monetize your events. When attendees buy tickets using supported payment gateways (like bKash, Nagad, or SSLCommerz), the funds are securely processed. We charge a minimal nominal service fee per ticket.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Payouts are routed directly to your configured bank or mobile banking account per our standard billing cycles. Ensure your payment information is up-to-date in your organizer profile to avoid delays.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Event Guidelines</h2>
              <p>
                We strive to maintain a safe platform for all attendees. Events must comply with local laws and accurately represent what ticket holders can expect. Any event found violating our community guidelines may be taken down without notice.
              </p>
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-lg mb-4 text-white">Ready to host your next big event?</p>
            <a 
              href="/login" 
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Sign Up as Organizer
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
