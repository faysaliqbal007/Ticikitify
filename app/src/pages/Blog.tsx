import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Blog() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-8">Ticikitify Blog</h1>
        <div className="bg-dark-50 rounded-2xl p-8 border border-white/5 space-y-6 text-gray-300">
          <p>
            Welcome to the Ticikitify Blog! Here we share stories, tips, and insights about the event industry in Bangladesh.
          </p>
          <div className="space-y-8 mt-8">
            <article className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Top 5 Tips for Event Organizers in 2025</h2>
              <p className="text-sm text-gray-500 mb-4">Published on April 10, 2025</p>
              <p>Planning an event requires precision and creativity. Discover our top strategies to maximize ticket sales and ensure a memorable experience for your attendees...</p>
            </article>

            <article className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">How Ticikitify is Changing the Ticketing Landscape</h2>
              <p className="text-sm text-gray-500 mb-4">Published on March 25, 2025</p>
              <p>From seamless check-ins to robust analytics, learn how our platform is empowering local organizers to scale their events safely and efficiently...</p>
            </article>

            <article className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Upcoming Tech Conferences in Dhaka</h2>
              <p className="text-sm text-gray-500 mb-4">Published on March 15, 2025</p>
              <p>Looking to network and learn about the latest in technology? Check out the top tech events happening in Dhaka this season, available right here on Ticikitify...</p>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
