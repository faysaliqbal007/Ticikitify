import Navbar from '@/components/Navbar';

export default function OrganizerSupport() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">Support</h1>
          <p className="text-gray-400">
            Need help? This area will connect organizers with support, FAQs, and documentation.
          </p>
        </div>
      </main>
    </div>
  );
}

