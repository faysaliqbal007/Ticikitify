import Navbar from '@/components/Navbar';

export default function OrganizerRefunds() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">Refunds</h1>
          <p className="text-gray-400">
            Here organizers will review refund requests, approve or reject them, and see refund history.
          </p>
        </div>
      </main>
    </div>
  );
}

