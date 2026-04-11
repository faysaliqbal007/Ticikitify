import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-8">Help Center</h1>
        <div className="bg-dark-50 rounded-2xl p-8 border border-white/5 space-y-6 text-gray-300">
          <p>
            Welcome to the Ticikitify Help Center. We are here to assist you with any questions or issues you may have.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium text-white">How do I buy a ticket?</h3>
              <p className="mt-2 text-sm">Simply browse our events, click on the event you want to attend, and click "Book Tickets". Follow the payment prompts to complete your purchase securely.</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium text-white">How do I access my tickets?</h3>
              <p className="mt-2 text-sm">Once payment is successful, you can view your tickets by navigating to the "My Tickets" section in your account profile.</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium text-white">Is it safe to pay on Ticikitify?</h3>
              <p className="mt-2 text-sm">Yes, we partner with trusted gateways like bKash, Nagad, and SSLCommerz to ensure that all transactions are safe and encrypted.</p>
            </div>
          </div>
          
          <p className="mt-8">
            Still need help? Visit our <a href="/contact" className="text-cyan-400 hover:underline">Contact Us</a> page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
